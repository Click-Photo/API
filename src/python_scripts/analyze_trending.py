import sys
import json
import nltk
import math
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.cluster import KMeans
from nltk.stem import WordNetLemmatizer
import collections 
from collections import Counter


nltk.download("stopwords")
nltk.download('wordnet')
stop_words = set(nltk.corpus.stopwords.words("portuguese"))
lemmatizer = WordNetLemmatizer()

def preprocess_text(text):
    words = [lemmatizer.lemmatize(word.lower()) for word in text.split() if word.lower() not in stop_words and word.isalpha()]
    return ' '.join(words)

def cluster_texts(texts, k=3):
    # Convertendo stop_words para lista, pois TfidfVectorizer não aceita set diretamente
    vectorizer = TfidfVectorizer(stop_words=list(stop_words))
    tfidf_matrix = vectorizer.fit_transform(texts)
    km_model = KMeans(n_clusters=k)
    km_model.fit(tfidf_matrix)
    clustering = collections.defaultdict(list)
    for idx, label in enumerate(km_model.labels_):
        clustering[label].append(idx)
    return dict(clustering)

def extract_trending_topics(jobs, k=3):
    job_texts = [preprocess_text(job['titulo'] + ' ' + job['descricao']) for job in jobs]
    clusters = cluster_texts(job_texts, k)
    trending_topics = Counter()
    for cluster, indices in clusters.items():
        cluster_words = []
        for idx in indices:
            cluster_words.extend(job_texts[idx].split())
        most_common = Counter(cluster_words).most_common(1)
        for word, count in most_common:
            trending_topics[word] += count
    return [{"topic": word, "frequency": count} for word, count in trending_topics.items()]

if __name__ == "__main__":
    jobs = json.loads(sys.stdin.read())
    trending_topics = extract_trending_topics(jobs)
    print(json.dumps(trending_topics))
