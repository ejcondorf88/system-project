import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_pinecone import PineconeVectorStore

def test_ai_apis():
    """Prueba las APIs de OpenAI y Pinecone"""
    print("=== PRUEBA DE APIS DE IA ===")
    
    # Cargar variables de entorno
    load_dotenv()
    
    # Verificar claves
    openai_key = os.getenv("OPENAI_API_KEY")
    pinecone_key = os.getenv("PINECONE_API_KEY")
    index_name = os.getenv("PINECONE_INDEX_NAME", "chatbot")
    
    print(f"OpenAI Key: {'✅' if openai_key and openai_key != 'tu_clave_de_openai_aqui' else '❌'}")
    print(f"Pinecone Key: {'✅' if pinecone_key else '❌'}")
    print(f"Index Name: {index_name}")
    
    # Probar OpenAI
    if openai_key and openai_key != 'tu_clave_de_openai_aqui':
        try:
            print("\n🧪 Probando OpenAI...")
            llm = ChatOpenAI(model_name='gpt-3.5-turbo', temperature=0)
            response = llm.invoke("Di hola en español")
            print(f"✅ OpenAI funcionando: {response.content}")
        except Exception as e:
            print(f"❌ Error en OpenAI: {e}")
    else:
        print("\n⚠️  OpenAI no configurado")
    
    # Probar Pinecone
    if pinecone_key:
        try:
            print("\n🧪 Probando Pinecone...")
            embeddings = HuggingFaceEmbeddings(
                model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
            )
            vstore = PineconeVectorStore.from_existing_index(index_name, embeddings)
            
            # Buscar documentos
            docs = vstore.similarity_search("ejercicio", k=1)
            print(f"✅ Pinecone funcionando: {len(docs)} documentos encontrados")
            if docs:
                print(f"   Primer documento: {docs[0].page_content[:100]}...")
        except Exception as e:
            print(f"❌ Error en Pinecone: {e}")
    else:
        print("\n⚠️  Pinecone no configurado")
    
    # Probar integración completa
    if (openai_key and openai_key != 'tu_clave_de_openai_aqui' and pinecone_key):
        try:
            print("\n🧪 Probando integración completa...")
            
            # Crear prompt
            from langchain.prompts import ChatPromptTemplate
            from langchain_core.runnables import RunnableMap
            
            prompt = ChatPromptTemplate.from_template(
                "Eres un asistente experto en rutinas de ejercicio y fitness. Responde la siguiente pregunta utilizando los documentos como contexto:\n\n{context}\n\nPregunta: {question}\n\nResponde de manera clara, útil y motivadora."
            )
            
            chain = (
                RunnableMap({
                    "context": lambda x: "\n\n".join([doc.page_content for doc in x["docs"]]),
                    "question": lambda x: x["question"]
                })
                | prompt
                | llm
            )
            
            # Probar con una pregunta
            docs = vstore.similarity_search("rutina de ejercicios", k=2)
            response = chain.invoke({"question": "¿Qué ejercicios me recomiendas para cardio?", "docs": docs})
            
            print(f"✅ Integración funcionando: {response.content[:200]}...")
            
        except Exception as e:
            print(f"❌ Error en integración: {e}")
    else:
        print("\n⚠️  No se puede probar integración - faltan claves")

if __name__ == "__main__":
    test_ai_apis() 