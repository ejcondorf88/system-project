import os
from pinecone import Pinecone
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_pinecone import PineconeVectorStore
import os
os.environ["PINECONE_API_KEY"] = "pcsk_6FECK2_AZPddmaoWkDJxqaWGyoN8HsfsJXe67WHWtMoBSJkhZiaCQ58KDMgZJXHA2sqBWv"
INDEX_NAME = 'chatbot'
pdf_path = os.path.join(os.path.expanduser("~"), "Downloads", "Rutina-masa-muscular.pdf")


pc = Pinecone(api_key=os.environ["PINECONE_API_KEY"] )
index = pc.Index(INDEX_NAME)
indices = pc.list_indexes()

print(indices)


def text_to_pinecone(pdf_path):
    #cargamos el pdf
    loader = PyPDFLoader(pdf_path)
    text = loader.load()
    print(text)
    create_embeddings(text)

    return True
def create_embeddings(text):
    print(f"Creando el embedding del archivo....")

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=100,
        length_function=len
        )
    chunks = text_splitter.split_documents(text)

    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")
    print(embeddings)
    PineconeVectorStore.from_documents(
        chunks,
        embeddings,
        index_name=INDEX_NAME
    )

if __name__ == "__main__":
    docs = text_to_pinecone(pdf_path)