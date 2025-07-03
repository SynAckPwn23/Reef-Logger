from flask import Flask, render_template, request, jsonify
import json
import os
from collections import OrderedDict

app = Flask(__name__)

DATA_FILE = 'data.json'

# Inizializza il file dati se non esiste
if not os.path.exists(DATA_FILE):
    with open(DATA_FILE, 'w') as f:
        json.dump([], f)

# Ordina i campi secondo schema desiderato
def ordina_campi(record):
    return OrderedDict([
        ("datetime", record.get("datetime")),
        ("temp", record.get("temp")),
        ("salinity", record.get("salinity")),
        ("ph", record.get("ph")),
        ("mg", record.get("mg")),
        ("ca", record.get("ca")),
        ("kh", record.get("kh")),
        ("no3", record.get("no3")),
        ("po4", record.get("po4")),
        ("note", record.get("note"))
    ])

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/submit', methods=['POST'])
def submit():
    data = request.get_json()

    if not data.get('datetime'):
        return jsonify({"status": "error", "message": "Campo data/ora mancante."}), 400

    with open(DATA_FILE, 'r+') as f:
        valori = json.load(f)

        if any(v.get('datetime') == data.get('datetime') for v in valori):
            return jsonify({"status": "error", "message": "Misurazione con stessa data/ora già presente."}), 400

        valori.append(data)

        # Ordina TUTTI i record prima di salvare
        ordinati = [ordina_campi(v) for v in valori]

        f.seek(0)
        json.dump(ordinati, f, indent=2)
        f.truncate()

    return jsonify({"status": "ok"})

@app.route('/data')
def get_data():
    with open(DATA_FILE, 'r') as f:
        valori = json.load(f)
    valori.sort(key=lambda x: x.get("datetime", ""), reverse=True)
    return jsonify(valori)

@app.route('/delete_by_datetime/<datetime>', methods=['DELETE'])
def delete_by_datetime(datetime):
    with open(DATA_FILE, 'r+') as f:
        valori = json.load(f)
        nuovi_valori = [v for v in valori if v.get("datetime") != datetime]

        # Ordina anche dopo eliminazione
        ordinati = [ordina_campi(v) for v in nuovi_valori]

        f.seek(0)
        json.dump(ordinati, f, indent=2)
        f.truncate()
    return jsonify({"status": "ok"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)