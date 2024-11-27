import sys
import json
import nltk
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.cluster import KMeans
from nltk.stem import WordNetLemmatizer
import collections 
from collections import Counter
import re

nltk.download("stopwords")
nltk.download('wordnet')

stop_words = set(nltk.corpus.stopwords.words("portuguese"))
lematizador = WordNetLemmatizer()

def preprocess_text(texto):
    texto_limpo = re.sub(r'[^\w\s]', '', texto)
    palavras = [lematizador.lemmatize(palavra.lower()) for palavra in texto_limpo.split() if palavra.lower() not in stop_words and palavra.isalpha()]
    return ' '.join(palavras)

def cluster_texts(texts, k=3):
    vetorizador = TfidfVectorizer(stop_words=list(stop_words))
    tfidf_matriz = vetorizador.fit_transform(texts)

    km_modelo = KMeans(n_clusters=k)
    km_modelo.fit(tfidf_matriz)

    clustering = collections.defaultdict(list)
    for index, label in enumerate(km_modelo.labels_):
        clustering[label].append(index)

    return dict(clustering)

def extrair_trending_topics(jobs, k=3):
    job_texts = [preprocess_text(job['titulo'] + ' ' + job['descricao']) for job in jobs]
    clusters = cluster_texts(job_texts, k)
    trending_topics = Counter()

    for cluster, indices in clusters.items():
        cluster_palavras = []

        for index in indices:
            cluster_palavras.extend(job_texts[index].split())

        palavras_mais_comuns = Counter(cluster_palavras).most_common(1)

        for palavra, count in palavras_mais_comuns:
            trending_topics[palavra] += count

    return [{ "topic": palavra, "frequency": count } for palavra, count in trending_topics.items()]

if __name__ == "__main__":
    jobs = json.loads(sys.stdin.read())

    trending_topics = extrair_trending_topics(jobs)

    print(json.dumps(trending_topics))

