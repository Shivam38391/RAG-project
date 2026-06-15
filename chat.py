from packages.rag.chain import ask

while True:

    question = input("\nQuestion: ")

    

    if question.lower() == "exit":
        break

    # answer = ask(question)

    # print("\nAnswer:")
    # print(answer)


    result = ask(question)

    print("\nAnswer:")
    print(result["answer"])

    print("\nSources:")
    for source in result["sources"]:
        print(source)