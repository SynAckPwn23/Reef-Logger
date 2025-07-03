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
