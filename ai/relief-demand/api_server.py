"""
AapdaSathi - M3 AI Engine HTTP Microservice
Runs on zero external dependencies using Python's standard library.
Endpoints:
- POST /api/relief/priority-score
- POST /api/relief/match-need
- POST /api/relief/demand-forecast
- POST /api/relief/coverage-score
- GET  /api/relief/health
"""

import json
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse
from relief_engine import (
    calculate_priority_score,
    match_need_to_relief,
    forecast_relief_demand,
    calculate_essential_coverage
)

PORT = 5003

class ReliefApiHandler(BaseHTTPRequestHandler):
    def _send_json(self, status: int, data: dict):
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        self.wfile.write(json.dumps(data, indent=2).encode("utf-8"))

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path in ["/api/relief/health", "/"]:
            self._send_json(200, {
                "status": "healthy",
                "service": "AapdaSathi Member 3 Relief Intelligence & AI Engine",
                "endpoints": [
                    "POST /api/relief/priority-score",
                    "POST /api/relief/match-need",
                    "POST /api/relief/demand-forecast",
                    "POST /api/relief/coverage-score"
                ]
            })
        else:
            self._send_json(404, {"error": "Not Found"})

    def do_POST(self):
        parsed = urlparse(self.path)
        content_length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_length).decode("utf-8") if content_length > 0 else "{}"
        
        try:
            payload = json.loads(body)
        except Exception:
            self._send_json(400, {"error": "Invalid JSON payload"})
            return

        if parsed.path == "/api/relief/priority-score":
            result = calculate_priority_score(
                population=payload.get("population", 100),
                urgency=payload.get("urgency", "MODERATE"),
                vulnerable_count=payload.get("vulnerable_count", {}),
                road_blocked=payload.get("road_blocked", False),
                current_shortage_ratio=payload.get("current_shortage_ratio", 0.5)
            )
            self._send_json(200, result)

        elif parsed.path == "/api/relief/match-need":
            result = match_need_to_relief(
                requested_item=payload.get("requested_item", "Drinking Water"),
                required_quantity=float(payload.get("required_quantity", 100)),
                request_lat=float(payload.get("request_lat", 26.1445)),
                request_lon=float(payload.get("request_lon", 91.7362)),
                inventory_depots=payload.get("inventory_depots", [])
            )
            self._send_json(200, result)

        elif parsed.path == "/api/relief/demand-forecast":
            result = forecast_relief_demand(
                disaster_type=payload.get("disaster_type", "Flood"),
                severity=payload.get("severity", "HIGH"),
                population_affected=int(payload.get("population_affected", 1000)),
                expected_duration_days=int(payload.get("expected_duration_days", 3)),
                current_stocks=payload.get("current_stocks", {})
            )
            self._send_json(200, result)

        elif parsed.path == "/api/relief/coverage-score":
            result = calculate_essential_coverage(
                requirements=payload.get("requirements", {})
            )
            self._send_json(200, result)

        else:
            self._send_json(404, {"error": f"Unknown endpoint {parsed.path}"})

if __name__ == "__main__":
    server = HTTPServer(("0.0.0.0", PORT), ReliefApiHandler)
    print(f"🚀 AapdaSathi Relief AI Service running on http://localhost:{PORT}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
