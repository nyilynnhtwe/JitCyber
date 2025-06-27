export const fetchQuizzes = async (setQuizzes, setIsLoading, page, limit) => {
    setIsLoading(true);
    try {
        const res = await fetch(`/api/admin/quizzes?page=${page}&limit=${limit}`);
        const data = await res.json();
        setQuizzes(data.quizzes);
    } catch (err) {
        console.error("Failed to fetch quizzes:", err);
    } finally {
        setIsLoading(false);
    }
};


