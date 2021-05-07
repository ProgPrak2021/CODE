import requests

api_key = "AIzaSyCtU_yY1gjbJTrrMm1e079QbPFkcbD-Q24"
body = {
    "client": {
        "clientId": "ProgPrak",
        "clientVersion": "141"
    },
    "threatInfo": {
        "threatTypes": ["MALWARE", "SOCIAL_ENGINEERING"],
        "platformTypes": ["WINDOWS"],
        "threatEntryTypes": ["URL"],
        "threatEntries": [
            {
                "url": "https://www.koolair.com/de/katalog/difusor-lineal-alta-induccion-medio-largo-alcance-df-47-narrow/"},
            {"url": "https://cricfree.sc/"},
            { "url": "https://www.modellbau-bochum.de/DF-Models"}
        ]
    }
}


def api_call(request, body, type):
    if type == "POST":
        response = requests.post(request, data=None, json=body)
    else:
        response = requests.get(request)

    print(response.json())
    print(response.status_code)


api_call(f" https://safebrowsing.googleapis.com/v4/threatMatches:find?key={api_key}", body, "POST")
api_call(f"https://safebrowsing.googleapis.com/v4/threatLists?key={api_key}", None, "GET")
