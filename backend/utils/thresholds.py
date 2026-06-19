THRESHOLDS = {
    "methane_ppm": {
        "safe":    3000,
        "warning": 3500,
        "danger":  4500
    },
    "co_ppm": {
        "safe":    200,
        "warning": 300,
        "danger":  400
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
    },
    "smoke_ppm": {
        "safe":    3000,
        "warning": 3800,
        "danger":  4500
    }
}

def get_overall_status(methane, co, temp, humidity, smoke=0, fire_detected=False):
    """Returns 'SAFE', 'WARNING', or 'DANGER' based on all readings"""
    if fire_detected:
        return "DANGER"
        
    readings = {
        "methane_ppm": methane,
        "co_ppm": co,
        "temperature_c": temp,
        "humidity_percent": humidity,
        "smoke_ppm": smoke
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
