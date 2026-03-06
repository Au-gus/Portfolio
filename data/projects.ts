export type Project = {
    id: string;
    title: string;
    category: string;
    platform: string;
    image: string;
    datasetSize?: string;
    language: string;
    libraries: string[];
    context: string;
    methodology: string;
    codeSnippet: string;
    learnings: string;
    featured: boolean;
    tags: string[];
    liveUrl?: string;
    githubUrl?: string;
};

export const projectDetails: Record<string, Omit<Project, "id">> = {
    "1": {
        title: "Titanic Survival Prediction",
        category: "Data Science",
        platform: "Kaggle",
        image: "/images/projects/titanic_prediction.png",
        datasetSize: "891 rows (Training), 418 rows (Test)",
        language: "Python",
        libraries: ["Pandas", "Scikit-Learn", "Matplotlib", "Seaborn"],
        featured: true,
        tags: ["ML", "Classification", "EDA"],
        context: "The sinking of the Titanic is one of the most infamous shipwrecks in history. This project builds a predictive model that answers: what sorts of people were more likely to survive? — using passenger data (name, age, gender, socio-economic class, etc).",
        methodology: "1. Handled missing data in 'Age' and 'Embarked' columns.\n2. Engineered new features like 'FamilySize' from 'SibSp' and 'Parch'.\n3. One-hot encoded categorical variables ('Sex', 'Embarked').\n4. Trained a Random Forest Classifier and optimized hyperparameters via GridSearchCV.",
        codeSnippet: `import pandas as pd
from sklearn.ensemble import RandomForestClassifier

train_df = pd.read_csv('train.csv')
train_df['FamilySize'] = train_df['SibSp'] + train_df['Parch'] + 1

features = ['Pclass', 'Sex', 'Age', 'Fare', 'FamilySize']
X = pd.get_dummies(train_df[features])
y = train_df['Survived']

model = RandomForestClassifier(n_estimators=100, max_depth=5, random_state=42)
model.fit(X, y)`,
        learnings: "Achieved 82% accuracy on the validation set. Females and first-class passengers had a significantly higher survival rate. Engineering 'FamilySize' proved crucial for model improvement.",
    },
    "2": {
        title: "Unemployment Analysis",
        category: "Data Analysis",
        platform: "CodeAlpha",
        image: "/images/projects/unemployment_analysis.png",
        datasetSize: "267 rows (Monthly Data per Region)",
        language: "Python",
        libraries: ["Pandas", "Plotly", "Matplotlib", "Seaborn"],
        featured: true,
        tags: ["EDA", "Visualization", "COVID-19"],
        context: "This project analyzes and visualizes the unemployment rate across different regions of India during the COVID-19 pandemic to understand the economic impact through interactive charts.",
        methodology: "1. Cleaned the dataset, removing trailing spaces in column headers.\n2. Converted Date strings into datetime objects.\n3. Segmented data by Region and utilized Plotly for interactive sunburst and bar charts.",
        codeSnippet: `import pandas as pd
import plotly.express as px

df = pd.read_csv('Unemployment_in_India.csv')
df.columns = df.columns.str.strip()

fig = px.bar(df, x='Region', y='Estimated Unemployment Rate (%)',
             color='Region', title='Unemployment Rate by Region',
             template='plotly_dark')
fig.show()`,
        learnings: "Visualizations clearly depicted a massive spike in unemployment during the April-May 2020 lockdown. Plotly proved highly effective at rendering interactive data maps for regional comparisons.",
    },
    "3": {
        title: "Iris Classification",
        category: "Machine Learning",
        platform: "CodeAlpha",
        image: "/images/projects/iris_classification.png",
        datasetSize: "150 rows, 4 features",
        language: "Python",
        libraries: ["Scikit-Learn", "Numpy", "Pandas"],
        featured: false,
        tags: ["ML", "Classification", "SVM"],
        context: "The Iris flower dataset consists of 50 samples from each of three species of Iris. This project classifies species using classical ML models and compares their accuracy.",
        methodology: "1. Extracted petal and sepal measurements as X, species as Y.\n2. Split dataset 80/20 for training and testing.\n3. Compared SVC and Logistic Regression classification boundaries.\n4. Evaluated using accuracy score and classification report.",
        codeSnippet: `from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score

iris = load_iris()
X, y = iris.data, iris.target
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

clf = SVC(kernel='linear')
clf.fit(X_train, y_train)
print(f'Accuracy: {accuracy_score(y_test, clf.predict(X_test))*100:.2f}%')`,
        learnings: "Model achieved 100% accuracy on the test set, demonstrating the linear separability of the Setosa class. SVC proved highly robust for small-scale multivariate classification.",
    },
    "4": {
        title: "Loan Predictions",
        category: "Data Science",
        platform: "Analytics Vidhya",
        image: "/images/projects/loan_predictions.png",
        datasetSize: "614 rows (Training)",
        language: "Python",
        libraries: ["Pandas", "Scikit-Learn", "XGBoost"],
        featured: false,
        tags: ["ML", "Classification", "XGBoost"],
        context: "Dream Housing Finance company wants to automate the loan eligibility process based on customer details. This project builds a classifier to predict approval in real-time.",
        methodology: "1. Imputed missing values using mode/median strategies.\n2. Applied log transformation to handle income skewness.\n3. Used SMOTE to handle class imbalance.\n4. Trained an XGBoost classifier for final predictions.",
        codeSnippet: `import pandas as pd, numpy as np
from xgboost import XGBClassifier
from imblearn.over_sampling import SMOTE

df = pd.read_csv('loan_train.csv')
df['LoanAmount_log'] = np.log(df['LoanAmount'])

X = pd.get_dummies(df.drop('Loan_Status', axis=1))
y = df['Loan_Status']
X_res, y_res = SMOTE(random_state=42).fit_resample(X, y)

model = XGBClassifier(eval_metric='logloss')
model.fit(X_res, y_res)`,
        learnings: "Log transformation on skewed income data improved generalization. SMOTE prevented the model from simply predicting 'Approve' for all, resulting in a robust 78% F1-score.",
    },
    "5": {
        title: "Amazon Clone",
        category: "Web Development",
        platform: "CSS Practice Project",
        image: "/images/projects/amazon_clone.png",
        language: "HTML / CSS",
        libraries: ["HTML5", "CSS3", "Flexbox", "Grid"],
        featured: true,
        tags: ["Front-End", "CSS", "Clone"],
        context: "A pixel-faithful recreation of the Amazon homepage built entirely from scratch using pure HTML and CSS — no frameworks. Goal: master complex layout techniques, responsive design, and UI replication at a professional scale.",
        methodology: "1. Structured the page with semantic HTML5 elements.\n2. Used CSS Flexbox for the navbar and product rows.\n3. CSS Grid for the hero panel and category card layout.\n4. Replicated hover states, transitions, and the sticky header.",
        codeSnippet: `/* Sticky Navbar */
.navbar {
    display: flex;
    align-items: center;
    background: #131921;
    position: sticky;
    top: 0;
    z-index: 100;
}

/* Product Grid */
.product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 16px;
    padding: 20px;
}`,
        learnings: "Gained deep hands-on experience with CSS positioning, Flexbox, and Grid. Replicating a production-level UI sharpened attention to detail — spacing, typography hierarchy, and hover states.",
    },
    "6": {
        title: "NLP Sentiment Analysis",
        category: "Natural Language Processing",
        platform: "Personal Project",
        image: "/images/projects/titanic_prediction.png",
        datasetSize: "~50k IMDB reviews",
        language: "Python",
        libraries: ["NLTK", "Scikit-Learn", "Pandas"],
        featured: true,
        tags: ["NLP", "Sentiment", "Text Classification"],
        context: "A text classification pipeline that determines whether a movie review carries a positive or negative sentiment. Built as a foundational NLP project to learn core text preprocessing and feature extraction techniques.",
        methodology: "1. Cleaned raw text: removed HTML tags, punctuation, and stopwords.\n2. Applied stemming using NLTK's PorterStemmer.\n3. Vectorized text with TF-IDF (unigrams + bigrams).\n4. Trained a Logistic Regression classifier evaluated with precision, recall, and F1.",
        codeSnippet: `import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

def clean_text(text):
    text = re.sub(r'<.*?>', '', text)
    text = re.sub(r'[^a-zA-Z]', ' ', text)
    return text.lower()

tfidf = TfidfVectorizer(max_features=10000, ngram_range=(1,2))
X = tfidf.fit_transform(df['review'].apply(clean_text))
y = df['sentiment']

model = LogisticRegression()
model.fit(X, y)`,
        learnings: "NLP text preprocessing is half the battle — dirty text severely degrades accuracy. Bigrams captured phrases like 'not good' that unigrams miss, boosting F1 by ~4%.",
    },
    "7": {
        title: "YOLO Object Detection",
        category: "Computer Vision",
        platform: "Personal Project",
        image: "/images/projects/unemployment_analysis.png",
        language: "Python",
        libraries: ["YOLOv5", "OpenCV", "PyTorch"],
        featured: false,
        tags: ["CV", "YOLO", "Object Detection"],
        context: "An introduction to real-time object detection using a pre-trained YOLOv5 model. Explored how YOLO performs single-shot detection to identify and localize multiple objects in images and video streams.",
        methodology: "1. Loaded a pre-trained YOLOv5s model from Ultralytics.\n2. Ran inference on test images and video frames.\n3. Parsed bounding boxes, confidence scores, and class labels.\n4. Rendered detections with OpenCV for visualization.",
        codeSnippet: `import torch, cv2

model = torch.hub.load('ultralytics/yolov5', 'yolov5s', pretrained=True)

results = model('test_image.jpg')
results.print()
results.show()

cap = cv2.VideoCapture('video.mp4')
while cap.isOpened():
    ret, frame = cap.read()
    if not ret: break
    results = model(frame)
    cv2.imshow('YOLO', results.render()[0])`,
        learnings: "YOLO's single-pass architecture makes real-time detection feasible even on a laptop CPU. Confidence thresholds are critical — too low floods with false positives, too high drops valid detections.",
    },
    "8": {
        title: "Predict Number of Upvotes",
        category: "Machine Learning",
        platform: "Analytics Vidhya",
        image: "/images/projects/loan_predictions.png", // Using placeholder image for now
        datasetSize: "330k rows (Training)",
        language: "Python",
        libraries: ["Pandas", "Scikit-Learn", "CatBoost", "NLTK"],
        featured: true,
        tags: ["ML", "Regression", "NLP", "CatBoost"],
        context: "A hackathon challenge to predict the number of upvotes a question will receive on a Q&A platform based on user metrics and question text.",
        methodology: "1. Explored user reputation, views, and answers as numerical features.\n2. Applied NLP techniques (TF-IDF) to the problem text.\n3. Handled highly skewed right-tailed target distribution with log+1 transformations.\n4. Trained an ensemble model led by CatBoost Regressor.",
        codeSnippet: `import pandas as pd
from catboost import CatBoostRegressor
from sklearn.metrics import mean_squared_error

df = pd.read_csv('train.csv')
X = df[['Reputation', 'Answers', 'Views']]
y = df['Upvotes']

model = CatBoostRegressor(iterations=500, learning_rate=0.1, depth=6)
model.fit(X, y, verbose=100)`,
        learnings: "Feature engineering proved more valuable than complex algorithm tuning. The 'Views' to 'Answers' ratio was a massive signal. CatBoost out-of-the-box handled the scaling exceptionally well."
    },
    "9": {
        title: "Database Design & SQL",
        category: "Data Engineering",
        platform: "1_Data_Science_Omkar",
        image: "/images/projects/amazon_clone.png",
        language: "SQL",
        libraries: ["MySQL", "PostgreSQL"],
        featured: false,
        tags: ["SQL", "Database Design", "ETL"],
        context: "A deep dive into relational database architecture, focusing on normalization, writing complex queries, window functions, and designing schemas for e-commerce logic.",
        methodology: "1. Designed ER diagrams converting business logic to schema.\n2. Normalized tables up to 3NF to reduce data redundancy.\n3. Practiced complex recursive CTEs and performance tuning with indexes.\n4. Created analytical views spanning multiple fact and dimension tables.",
        codeSnippet: `WITH RankedSales AS (
  SELECT 
    employee_id,
    amount,
    date,
    ROW_NUMBER() OVER (PARTITION BY employee_id ORDER BY amount DESC) as rnk
  FROM sales
)
SELECT employee_id, amount
FROM RankedSales
WHERE rnk <= 3;`,
        learnings: "Understanding execution plans is critical for optimizing queries on millions of rows. Proper indexing on foreign keys drastically reduced JOIN latency.",
    }
};

export const getAllProjects = () =>
    Object.entries(projectDetails).map(([id, p]) => ({ id, ...p }));

export const getFeaturedProjects = () =>
    getAllProjects().filter((p) => p.featured).slice(0, 5);
