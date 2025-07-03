# 🐠 Aquarium Monitor – Flask App for Marine Tank Parameters

This is a lightweight web application built with Python Flask to help aquarium enthusiasts log, monitor, and visualize key water parameters in a marine tank such as KH, Ca, Mg, nitrates, and phosphates.

## 📸 Screenshot
*(You can add screenshots of the UI here)*

## 🚀 Features
- Manual input of aquarium parameters
- Local data storage in `data.json`
- Interactive frontend with basic charting
- Responsive UI using HTML, CSS, and JS

## 🏗️ Project Structure
aquarium-monitor/<br/>
├── app.py # Flask backend<br/>
├── data.json # Local data storage<br/>
├── static/<br/>
│ ├── app.js # Frontend logic<br/>
│ └── style.css # Custom styles<br/>
├── templates/<br/>
│ └── index.html # HTML template<br/>
└── data/ # (Optional folder for future data)<br/>

## ⚙️ Requirements
- Python 3.8+
- Flask

Install dependencies:
```bash
pip install flask
```
## ▶️ How to Run
```bash
python app.py
```
The app will be available at: http://localhost:5000

## 💾 Data Storage
Measurements are saved locally in the data.json file. You can manually edit or clear this file to reset the dataset.

## 📌 Notes
This app was developed for **personal use** on my local network to monitor and manage my own reef aquarium.
This is a **local-only** version and **not intended to be exposed on the Internet** for security reasons. 
- Data is stored locally in a JSON file; no database is used.
- The application is easily extendable with:
  - user authentication
  - database integration (e.g., SQLite, PostgreSQL)
  - RESTful APIs
  - advanced charting libraries (e.g., Chart.js)
  - email alerts, threshold warnings, etc.

## 🙌 Contributions
Pull requests, bug reports, and feature suggestions are welcome!
