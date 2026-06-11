THRESHOLDS = {
    "methane_ppm": {
        "safe":    1000,
        "warning": 2500,
        "danger":  5000
    },
    "co_ppm": {
        "safe":    25,
        "warning": 50,
        "danger":  100
    },
    "temperature_c": {
        "safe":    30,
        "warning": 35,
        "danger":  40
    },
    "humidity_percent": {
        "safe":    80,
        "warning": 90,
        "danger":  95
    }
}

def get_overall_status(methane, co, temp, humidity):
    """Returns 'SAFE', 'WARNING', or 'DANGER' based on all readings"""
    readings = {
        "methane_ppm": methane,
        "co_ppm": co,
        "temperature_c": temp,
        "humidity_percent": humidity
    }
    overall = "SAFE"
    for key, value in readings.items():
        if value is None:
            continue
        t = THRESHOLDS[key]
        if value >= t["danger"]:
            return "DANGER"
        elif value >= t["warning"]:
            overall = "WARNING"
    return overall
