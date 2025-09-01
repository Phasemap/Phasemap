import json
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, Union


def generate_json_report(
    data: Union[Dict[str, Any], list],
    filename: Union[str, Path] = "report.json",
    encoding: str = "utf-8"
) -> Path:
    """
    Generate a JSON report file with a timestamped envelope.

    Args:
        data: Any serializable object (dict, list, etc.) representing the report body.
        filename: Output filename (string or Path). Defaults to "report.json".
        encoding: File encoding. Defaults to "utf-8".

    Returns:
        Path: Path to the created JSON report file.
    """
    report = {
        "timestamp": datetime.now().astimezone().isoformat(),
        "summary": data,
    }

    file_path = Path(filename)
    file_path.parent.mkdir(parents=True, exist_ok=True)

    with file_path.open("w", encoding=encoding) as f:
        json.dump(report, f, ensure_ascii=False, indent=2)

    return file_path
