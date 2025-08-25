from flask import Flask, request, jsonify
import sqlite3

app = Flask(__name__)

def get_answer(question):
    conn = sqlite3.connect("faq.db")
    cursor = conn.cursor()
    cursor.execute("SELECT answer FROM faqs WHERE question = ?", (question,))
    row = cursor.fetchone()
    conn.close()
    return row[0] if row else None

@app.route("/ask", methods=["POST"])
def ask():
    data = request.json
    question = data.get("question", "")
    answer = get_answer(question)
    if answer:
        return jsonify({"answer": answer})
    else:
        return jsonify({"answer": "Sorry, I don’t know the answer to that question."})


if __name__ == '__main__':
    app.run(debug=True, port=5001)