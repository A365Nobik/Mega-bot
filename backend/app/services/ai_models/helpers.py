import json
import re
from typing import Optional


def extract_json_from_markdown(text: str) -> Optional[dict]:
    json_pattern = r"```json\s*\n(.*?)\n```"
    match = re.search(json_pattern, text, re.DOTALL)

    if match:
        try:
            data = json.loads(match.group(1))
            if "target_model" in data and data["target_model"]:
                data["target_model"] = data["target_model"].strip().title()
            return data
        except json.JSONDecodeError:
            pass

    try:
        data = json.loads(text)
        if "target_model" in data and data["target_model"]:
            data["target_model"] = data["target_model"].strip().title()
        return data
    except:
        pass

    return None
