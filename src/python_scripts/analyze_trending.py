import sys
import json
from collections import Counter
from nltk.corpus import stopwords
import nltk
import math

nltk.download("stopwords")
stop_words = set(stopwords.words("portuguese"))

def preprocess_text(text):
    words = [word.lower() for word in text.split() if word.lower() not in stop_words and word.isalpha()]
    return words

def calculate_similarity(words1, words2):
    common_words = set(words1) & set(words2)
    return len(common_words) / (math.sqrt(len(words1)) * math.sqrt(len(words2)))

def extract_trending_topics(jobs, k=3):
    job_texts = [preprocess_text(job['titulo'] + ' ' + job['descricao']) for job in jobs]
    topic_counter = Counter()

    for i, text1 in enumerate(job_texts):
        similar_texts = []
        for j, text2 in enumerate(job_texts):
            if i != j:
                similarity = calculate_similarity(text1, text2)
                if similarity > 0.5:  
                    similar_texts.append(jobs[j]['titulo'] + ' ' + jobs[j]['descricao'])
        all_words = []
        for text in similar_texts:
            all_words.extend(preprocess_text(text))

        common_words = Counter(all_words).most_common(k)
        for word, _ in common_words:
            topic_counter[word] += 1

    trending_topics = [{"topic": word, "frequency": count} for word, count in topic_counter.most_common(5)]
    return trending_topics

if __name__ == "__main__":
    jobs = json.loads(sys.stdin.read())
    trending_topics = extract_trending_topics(jobs)
    print(json.dumps(trending_topics))
