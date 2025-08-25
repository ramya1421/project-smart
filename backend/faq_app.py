import sqlite3

# connect to the database
conn = sqlite3.connect("faq.db")
cursor = conn.cursor()

def get_answer(question):
    cursor.execute("SELECT answer FROM faqs WHERE question = ?", (question,))
    result = cursor.fetchone()
    if result:
        return result[0]
    else:
        return "Sorry, I don’t know the answer to that question."

# Main loop
print("Ask me a question (type 'exit' to quit):\n")
while True:
    q = input("You: ")
    if q.lower() == "exit":
        break
    print("Bot:", get_answer(q))

conn.close()
