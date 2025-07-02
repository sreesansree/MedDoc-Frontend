import { useEffect, useState } from "react";
import { Card } from "flowbite-react";

const HealthNewsSection = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          "https://newsapi.org/v2/top-headlines?category=health&apiKey=ac1f404402ff40a093d215272505179c "
        );
        const data = await response.json();
        setArticles(data.articles.slice(0, 6)); // Show only 3 articles
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);
  if (loading)
    return <div className="text-center py-8">Loading health news...</div>;
  return (
    <div className="container mx-auto py-12 px-4 overflow-hidden">
      <h2 className="text-3xl font-bold text-center mb-8">
        Latest Health News
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((article, index) => (
          <Card key={index} className="h-full">
            <img
              src={article.urlToImage || "/medical-placeholder.jpg"}
              alt={article.title}
              className="h-48 w-full object-cover"
            />
            <h3 className="text-xl font-bold">{article.title}</h3>
            <p className="text-gray-600 line-clamp-3">{article.description}</p>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:underline mt-auto"
            >
              Read More
            </a>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HealthNewsSection;
