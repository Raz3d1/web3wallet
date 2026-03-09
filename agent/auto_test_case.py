import os
import time
import json
import re
import base64
import io
import csv
import warnings
import argparse
import xml.etree.ElementTree as ET
from datetime import datetime
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
from zai import ZhipuAiClient
from appium import webdriver
from appium.options.android import UiAutomator2Options

# 引入高级点击/滑动所需的库
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.actions import interaction
from selenium.webdriver.common.actions.action_builder import ActionBuilder
from selenium.webdriver.common.actions.pointer_input import PointerInput

# ================= 屏蔽烦人的警告 =================
warnings.filterwarnings("ignore", category=UserWarning)

# 配置文件所在目录（与 auto_test_case.py 同级的 agent 文件夹）
_AGENT_DIR = Path(__file__).resolve().parent

# ================= 外部配置加载 =================
try:
    with open(_AGENT_DIR / "expected_behaviors.json", "r", encoding="utf-8") as f:
        EXPECTED_BEHAVIORS = json.load(f)
except FileNotFoundError:
    print("⚠️ 未找到 expected_behaviors.json，请确保文件在 agent 目录下！")
    EXPECTED_BEHAVIORS = {}

try:
    with open(_AGENT_DIR / "target_buttons.json", "r", encoding="utf-8") as f:
        TARGET_BUTTONS = json.load(f)
except FileNotFoundError:
    print("⚠️ 未找到 target_buttons.json，请确保文件在 agent 目录下！")
    TARGET_BUTTONS = []

try:
    with open(_AGENT_DIR / "judge_rules.txt", "r", encoding="utf-8") as f:
        JUDGE_RULES = f.read()
except FileNotFoundError:
    print("⚠️ 未找到 judge_rules.txt，请确保文件在 agent 目录下！")
    JUDGE_RULES = ""

try:
    with open(_AGENT_DIR / "prompt_template.txt", "r", encoding="utf-8") as f:
        PROMPT_TEMPLATE = f.read().strip()
except FileNotFoundError:
    print("⚠️ 未找到 prompt_template.txt，请确保文件在 agent 目录下！")
    PROMPT_TEMPLATE = ""

try:
    with open(_AGENT_DIR / "browser_entry_prompt.txt", "r", encoding="utf-8") as f:
        BROWSER_ENTRY_PROMPT = f.read().strip()
except FileNotFoundError:
    print("⚠️ 未找到 browser_entry_prompt.txt，将使用内置默认提示")
    BROWSER_ENTRY_PROMPT = "根据当前页面元素判断：是钱包主界面(main)、地址栏(address_bar)、测试页已加载(dapp_loaded)还是未知(unknown)。返回 JSON: {\"screen_type\": \"...\", \"element_id\": 数字或null}"


# ================= 配置区域 =================

API_KEY = "c3ba4e78edb043cfa51cf3aa876ef936.fc4A5GXclfxuI7CS"
MODEL_NAME = 'glm-4.6v' 
MAX_STEPS = 100 

CAPS = {
    "platformName": "Android",
    "automationName": "UiAutomator2",
    "deviceName": "Pixel 4", 
    "noReset": True,
    "newCommandTimeout": 3600
}
SERVER_URL = "http://127.0.0.1:4723"
DEFAULT_WALLET_NAME = "MyWalletApp"

# App 内置浏览器要打开的测试 Dapp 地址（与 https://web3wallet-inky.vercel.app/ 一致）
DAPP_TEST_URL = "https://web3wallet-inky.vercel.app/"

def get_expected_behavior(btn_name):
    # 动态从加载的 expected_behaviors 字典中查询
    for key, val in EXPECTED_BEHAVIORS.items():
        if key in btn_name:
            return val
    return "显示清晰的交易详情，不能显示纯 16 进制乱码。"

# ================= 功能类 =================

class NativeZhipuClient:
    def __init__(self, api_key, model):
        self.client = ZhipuAiClient(api_key=api_key)
        self.model = model

    def generate_content(self, prompt_text, pil_image):
        buffered = io.BytesIO()
        
        # === 【核心修复】 ===
        # JPEG 不支持 RGBA (透明通道)，必须先转换为 RGB
        if pil_image.mode == 'RGBA':
            pil_image = pil_image.convert('RGB')
        # ===================

        pil_image.save(buffered, format="JPEG", quality=70) # 压缩加速
        img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")

        max_retries = 3
        for attempt in range(max_retries):
            try:
                print(f"      [AI] 正在分析界面... (第 {attempt + 1}/{max_retries} 次)")
                response = self.client.chat.completions.create(
                    model=self.model,
                    messages=[
                        {
                            "role": "user",
                            "content": [
                                {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{img_str}"}},
                                {"type": "text", "text": prompt_text}
                            ]
                        }
                    ],
                    thinking={"type": "enabled"},
                    response_format={"type": "json_object"},
                    temperature=0.1,
                    max_tokens=4096,
                    timeout=60
                )
                return response.choices[0].message.content
            except Exception as e:
                print(f"      [!] API 调用出错: {e}")
                if attempt < max_retries - 1:
                    time.sleep(3)
                else:
                    return None

class web3walletAgent:
    def __init__(self, wallet_name: str = DEFAULT_WALLET_NAME):
        self._init_output_dir()
        print("[*] 正在初始化 Appium 连接...")
        options = UiAutomator2Options().load_capabilities(CAPS)
        self.driver = webdriver.Remote(SERVER_URL, options=options)

        # 当前被测钱包名称（写入报告用）
        self.wallet_name = wallet_name
        
        print(f"[*] 正在加载智谱模型: {MODEL_NAME} ...")
        self.llm_client = NativeZhipuClient(API_KEY, MODEL_NAME)
        
        # === 核心状态管理 ===
        self.order_index = 0 # 当前执行到第几个任务
        self.test_results = []   
        self.current_testing_btn = None 
        self.last_action_summary = None
        # 阶段：find_browser（寻找并打开内置浏览器）→ testing（在 Dapp 页执行测试）
        self.phase = "find_browser"
        
        # 获取屏幕尺寸
        window_size = self.driver.get_window_size()
        self.screen_w = window_size['width']
        self.screen_h = window_size['height']

    def _init_output_dir(self):
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        self.output_dir = os.path.join("scan_logs", timestamp)
        os.makedirs(self.output_dir, exist_ok=True)
        print(f"\n[📂] 本次测试结果将保存在: {self.output_dir}")

    def get_element_hierarchy(self):
        """解析页面 XML"""
        source = self.driver.page_source
        if isinstance(source, bytes): source = source.decode('utf-8')
        source = re.sub(r'[^\x09\x0A\x0D\x20-\uD7FF\uE000-\uFFFD\u10000-\u10FFFF]+', '', source)
        
        try:
            root = ET.fromstring(source)
        except ET.ParseError:
            return {}, [], ""

        raw_elements = {}
        llm_context = []
        counter = 1
        
        for node in root.iter():
            bounds = node.get("bounds")
            if not bounds: continue
            try:
                pattern = re.compile(r"\[(\d+),(\d+)\]\[(\d+),(\d+)\]")
                match = pattern.search(bounds)
                if not match: continue
                x1, y1, x2, y2 = map(int, match.groups())
            except: continue
            
            w, h = x2 - x1, y2 - y1
            if w < 20 or h < 20: continue 
            
            text = node.get("text", "")
            desc = node.get("content-desc", "")
            clickable = node.get("clickable") == "true"
            cls = node.get("class", "")
            
            if clickable or text or desc:
                uid = counter
                display_text = text if text else desc
                
                raw_elements[uid] = {
                    "center": (x1 + w // 2, y1 + h // 2), 
                    "bounds": [x1, y1, x2, y2],
                    "text": display_text
                }
                
                llm_context.append({
                    "id": uid, 
                    "text": display_text[:40], 
                    "class": cls.split('.')[-1]
                })
                counter += 1
            
        return raw_elements, llm_context

    def draw_som_layer(self, raw_elements):
        screenshot_base64 = self.driver.get_screenshot_as_base64()
        image = Image.open(io.BytesIO(base64.b64decode(screenshot_base64)))
        draw = ImageDraw.Draw(image)
        try:
            font = ImageFont.truetype("arial.ttf", 20)
        except:
            font = ImageFont.load_default()
            
        for uid, data in raw_elements.items():
            x1, y1, x2, y2 = data['bounds']
            draw.rectangle([x1, y1, x2, y2], outline="red", width=2)
            draw.rectangle([x1, y1, x1+25, y1+18], fill="red")
            draw.text((x1+2, y1), str(uid), fill="white", font=font)
        return image

    def _analyze_browser_entry_screen(self, marked_image, llm_context):
        """用 AI 判断当前是主界面/地址栏/测试页已加载，并返回要点击的元素 id。"""
        prompt = BROWSER_ENTRY_PROMPT.replace("{{LLM_CONTEXT}}", json.dumps(llm_context, ensure_ascii=False))
        result_text = self.llm_client.generate_content(prompt, marked_image)
        if not result_text:
            return {"screen_type": "unknown", "element_id": None}
        try:
            text = result_text.replace("```json", "").replace("```", "").strip()
            return json.loads(text)
        except Exception:
            return {"screen_type": "unknown", "element_id": None}

    def _ensure_in_dapp_browser(self, max_attempts=40):
        """
        识别 App 主界面后自动查找浏览器入口并点击，在地址栏输入 DAPP_TEST_URL，直到测试 Dapp 页面加载完成。
        返回 True 表示已进入测试页，False 表示超时未进入。
        """
        print("\n>>> [内置浏览器] 开始：识别主界面 → 打开浏览器 → 输入测试网址")
        for attempt in range(1, max_attempts + 1):
            print(f"\n--- 浏览器入口阶段 第 {attempt}/{max_attempts} 步 ---")
            raw, ctx = self.get_element_hierarchy()
            img = self.draw_som_layer(raw)
            img.save(os.path.join(self.output_dir, f"browser_phase_{attempt}.png"))
            res = self._analyze_browser_entry_screen(img, ctx)
            screen_type = (res.get("screen_type") or "unknown").strip().lower()
            element_id = res.get("element_id")

            if screen_type == "dapp_loaded":
                print("   > ✅ 已识别到测试 Dapp 页面，进入测试阶段")
                self.phase = "testing"
                return True

            if screen_type == "main" and element_id is not None and int(element_id) in raw:
                cx, cy = raw[int(element_id)]["center"]
                print(f"   > 🌐 识别为主界面，点击浏览器入口 (id={element_id})")
                self.driver.tap([(cx, cy)])
                time.sleep(3)
                continue

            if screen_type == "address_bar" and element_id is not None and int(element_id) in raw:
                cx, cy = raw[int(element_id)]["center"]
                x1, y1, x2, y2 = raw[int(element_id)]["bounds"]
                print(f"   > 📍 识别到地址栏，输入: {DAPP_TEST_URL}")
                # 优先：定位到该区域内的 EditText 并直接 send_keys，不依赖剪贴板粘贴
                input_done = False
                try:
                    edit_list = self.driver.find_elements(By.CLASS_NAME, "android.widget.EditText")
                    for el in edit_list:
                        try:
                            loc = el.location
                            sz = el.size
                            # 该 EditText 的矩形是否包含我们识别的地址栏中心点
                            if (loc["x"] <= cx <= loc["x"] + sz["width"] and
                                loc["y"] <= cy <= loc["y"] + sz["height"]):
                                el.click()
                                time.sleep(0.3)
                                el.clear()
                                el.send_keys(DAPP_TEST_URL)
                                input_done = True
                                print("   > 已通过 EditText.send_keys 填入地址")
                                break
                        except Exception:
                            continue
                except Exception as e:
                    print(f"   > [EditText 定位] {e}")
                # 备用：点击输入框 + 剪贴板粘贴
                if not input_done:
                    self.driver.tap([(cx, cy)])
                    time.sleep(1.2)
                    try:
                        self.driver.set_clipboard_text(DAPP_TEST_URL)
                        time.sleep(0.4)
                    except Exception:
                        pass
                    for _ in range(2):
                        try:
                            self.driver.press_keycode(279)  # KEYCODE_PASTE (Android 10+)
                            break
                        except Exception:
                            try:
                                self.driver.press_keycode(50, metastate=0x1000)  # Ctrl+V
                                break
                            except Exception:
                                time.sleep(0.3)
                    time.sleep(0.5)
                    print("   > 已通过剪贴板粘贴尝试填入地址")
                self.driver.press_keycode(66)  # KEYCODE_ENTER / Go
                print("   > ⏳ 等待页面加载 (15s)...")
                time.sleep(15)
                continue

            if screen_type == "visit_link" and element_id is not None and int(element_id) in raw:
                cx, cy = raw[int(element_id)]["center"]
                print("   > 🔗 识别到「访问链接/Visit link」确认项，点击进入")
                self.driver.tap([(cx, cy)])
                time.sleep(5)
                continue

            if screen_type == "unknown":
                print("   > ⚠️ 未识别界面类型，等待 2s 后重试")
            time.sleep(2)

        print("   > ❌ 未能在限定步数内进入测试页，请检查 App 是否已打开且网络正常")
        return False

    def analyze_with_gemini(self, marked_image, llm_context, step_num):
        last_summary = self.last_action_summary if self.last_action_summary else "无 (第一步)"
        
        if self.order_index >= len(TARGET_BUTTONS):
            return {"action_type": "finish", "thought": "所有指定按钮测试完毕。"}
            
        target_btn_name = TARGET_BUTTONS[self.order_index]
        pending_btn = self.current_testing_btn if self.current_testing_btn else "无"
        expected_desc = get_expected_behavior(target_btn_name)

        # 动态替换模板变量
        prompt = PROMPT_TEMPLATE.replace("{{STEP_NUM}}", str(step_num)) \
                                .replace("{{TARGET_BTN_NAME}}", target_btn_name) \
                                .replace("{{PENDING_BTN}}", pending_btn) \
                                .replace("{{ORDER_INDEX}}", str(self.order_index + 1)) \
                                .replace("{{TOTAL_TASKS}}", str(len(TARGET_BUTTONS))) \
                                .replace("{{EXPECTED_DESC}}", expected_desc) \
                                .replace("{{JUDGE_RULES}}", JUDGE_RULES) \
                                .replace("{{LLM_CONTEXT}}", json.dumps(llm_context, ensure_ascii=False))

        result_text = self.llm_client.generate_content(prompt, marked_image)
        if not result_text: return None

        try:
            text = result_text.replace("```json", "").replace("```", "").strip()
            return json.loads(text)
        except Exception as e:
            print(f"      [!] JSON 解析失败: {e}")
            return None
        
    def execute_actions(self, ai_result, raw_elements):
        if not ai_result: return False

        thought = ai_result.get("thought", "")
        action = ai_result.get("action_type", "")
        uid = ai_result.get("target_id")
        btn_name = ai_result.get("button_name", "")
        judge = ai_result.get("judge_result", "")

        print(f"\n[AI 思考] {thought}")
        target_now = TARGET_BUTTONS[self.order_index] if self.order_index < len(TARGET_BUTTONS) else "Done"
        print(f"[AI 决策] 动作: {action} | 当前目标: {target_now}")

        self.last_action_summary = f"上一步 {action} ({judge})"

        if action == "finish": return "FINISH"

        # === 1. 点击目标按钮 ===
        if action == "click_test_button":
            if self.current_testing_btn is not None and btn_name == self.current_testing_btn:
                print(f"   > 🛑 [死循环保护] 强制判定 '{btn_name}' -> !3")
                self._record_result("!3")
                return "WAIT_SHORT"

            if self.current_testing_btn is not None:
                print(f"   > [自动补录] 上一个 '{self.current_testing_btn}' 记为 !3")
                self._record_result("!3")
                return "WAIT_SHORT"

            if uid and int(uid) in raw_elements:
                self.current_testing_btn = btn_name 
                cx, cy = raw_elements[int(uid)]['center']
                print(f"   > 🖱️ 点击目标: {btn_name}")
                self.driver.tap([(cx, cy)])
                return "WAIT_LONG" 
            else:
                print("   > [错误] 找不到按钮 ID")
                return False

        # === 2. 拒绝/关闭弹窗 ===
        elif action == "record_and_reject":
            self._record_result(judge) 
            
            if uid and int(uid) in raw_elements:
                target_el = raw_elements[int(uid)]
                btn_text = target_el.get('text', '').lower()
                
                unsafe_keywords = ['approve', 'confirm', 'sign', 'send', '授权', '确认', '签名', '发送', '同意']
                is_dangerous = False
                if len(btn_text) < 20: 
                    for kw in unsafe_keywords:
                        if kw in btn_text:
                            is_dangerous = True
                            break
                
                if is_dangerous:
                    print(f"   > ⚠️ [安全拦截] AI 试图点击 '{btn_text}' 来拒绝，已被脚本拦截！")
                    print(f"   > 🛡️ 转为执行：物理返回键")
                    self.driver.press_keycode(4)
                else:
                    cx, cy = target_el['center']
                    print(f"   > ❎ 点击 UI 关闭 (ID: {uid} | Text: {btn_text})")
                    self.driver.tap([(cx, cy)])
            else:
                print(f"   > [降级] 未找到ID，使用物理返回")
                self.driver.press_keycode(4)
            return "WAIT_SHORT"

        # === 3. 物理返回 ===
        elif action == "record_and_physical_back":
            self._record_result(judge) 
            print(f"   > 🔙 物理返回")
            self.driver.press_keycode(4) 
            return "WAIT_SHORT"

        # === 4. 翻页寻找 ===
        elif action == "scroll_down":
            print("   > ⬇️ 翻页寻找目标...")
            if self.current_testing_btn is not None:
                print(f"   > [自动补录] '{self.current_testing_btn}' -> !3")
                self._record_result("!3")
            
            self.driver.swipe(self.screen_w//2, int(self.screen_h*0.75), self.screen_w//2, int(self.screen_h*0.35), 1000)
            return "WAIT_SHORT"

        # === 5. 无反应/默认拒绝 ===
        elif action == "record_and_continue": 
            print(f"   > ⚠️ 按钮无反应，记为 !3")
            self._record_result(judge) 
            return "WAIT_SHORT"

        return False

    def _record_result(self, judge):
        btn_name = self.current_testing_btn if self.current_testing_btn else TARGET_BUTTONS[self.order_index]
        
        print(f"   > ✅ [测试完成] {btn_name} -> {judge}")
        print(f"   > ⏩ 进度推进: {self.order_index} -> {self.order_index + 1}")
        
        self.test_results.append({
            "wallet_name": self.wallet_name,
            "button_name": btn_name,
            "result": judge
        })
        
        self.current_testing_btn = None 
        self.order_index += 1

    def save_report(self):
        csv_path = os.path.join(self.output_dir, "test_report.csv")
        try:
            with open(csv_path, mode='w', newline='', encoding='utf-8') as file:
                writer = csv.writer(file)
                writer.writerow(["wallet name", "button name", "result"])
                for item in self.test_results:
                    writer.writerow([item["wallet_name"], item["button_name"], item["result"]])
            print(f"\n[📊] 报告已保存: {csv_path}")
        except Exception as e:
            print(f"[❌] 保存报告失败: {e}")

    def run(self):
        print("\n>>> Web3 钱包 App 内置浏览器自动化测试 <<<")
        print(f"测试 Dapp: {DAPP_TEST_URL}")
        print(f"待测按钮数: {len(TARGET_BUTTONS)}")
        input("请先确保钱包 App 已打开并处于主界面，按回车开始...")
        
        try:
            # 阶段一：识别主界面 → 点击浏览器入口 → 输入测试 URL，直到 Dapp 页加载
            if not self._ensure_in_dapp_browser():
                print("[!] 未能进入测试页，脚本结束")
                return
            
            # 阶段二：在 Dapp 页按顺序点击测试按钮并判定
            for step in range(1, MAX_STEPS + 1):
                if self.order_index >= len(TARGET_BUTTONS):
                    print("所有任务已完成！")
                    break
                    
                print(f"\n======== Step {step} (Target: {TARGET_BUTTONS[self.order_index]}) ========")
                
                raw, ctx = self.get_element_hierarchy()
                img = self.draw_som_layer(raw)
                img.save(os.path.join(self.output_dir, f"step_{step}.png"))
                
                res = self.analyze_with_gemini(img, ctx, step)
                status = self.execute_actions(res, raw)
                
                if status == "FINISH": break
                
                if status == "WAIT_LONG":
                    print("   > ⏳ 等待弹窗 (10s)...")
                    time.sleep(20)
                elif status == "WAIT_SHORT":
                    time.sleep(3)
                else:
                    time.sleep(2)
                
        finally:
            self.save_report()
            self.driver.quit()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Web3 钱包自动化安全测试代理")
    parser.add_argument(
        "--wallet",
        "--wallet-name",
        dest="wallet_name",
        default=DEFAULT_WALLET_NAME,
        help="当前被测钱包名称（用于报告标记）",
    )
    args = parser.parse_args()

    agent = web3walletAgent(wallet_name=args.wallet_name)
    agent.run()