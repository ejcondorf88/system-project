import os
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader
from langchain_community.vectorstores import Pinecone as PineconeStore
from langchain_huggingface import HuggingFaceEmbeddings
from vector import Pinecone

pdf_path = os.path.join(os.path.expanduser("~"), "Downloads", "Rutina-masa-muscular.pdf")

PINECONE_API_KEY = "pcsk_6FECK2_AZPddmaoWkDJxqaWGyoN8HsfsJXe67WHWtMoBSJkhZiaCQ58KDMgZJXHA2sqBWv"
INDEX_NAME = 'chatbot'

os.environ["PINECONE_API_KEY"] = PINECONE_API_KEY



pinecone = Pinecone(api_key=PINECONE_API_KEY)
index = pinecone.Index("chatbot")




# def text_to_pinecone(pdf):
#     loader = PyPDFLoader(pdf)
#     text = loader.load()
#     create_emdeddings(text)
#     return True
#
# def create_emdeddings(text):
#     print(f"Creando Embeddins del archivo: ")
#     text_splitter = RecursiveCharacterTextSplitter(
#         chunk_size=800,
#         chunk_overlap=100,
#         length_function=len
#     )
#
#     chunks = text_splitter.split_documents(text)
#
#     embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")
#     PineconeStore.from_documents(
#         chunks,
#         embedding=embeddings,
#         index_name=INDEX_NAME)
#     return True
#
#
# if __name__ == "__main__":
#     text_to_pinecone(pdf_path)

def load_pdf(path):
    loader = PyPDFLoader(path)
    return loader.load()

def split_text(text):
    splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=100)
    return splitter.split_documents(text)

def embed_and_store(chunks):
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")
    PineconeStore.from_documents(documents=chunks, embedding=embeddings, index_name=INDEX_NAME)
    print("Embeddings creados y almacenados en Pinecone.")

if __name__ == "__main__":
    docs = load_pdf(pdf_path)
    chunks = split_text(docs)
    embed_and_store(chunks)