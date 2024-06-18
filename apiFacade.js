const endpoint = "http://localhost:8080";

const fetchStageResults = async () => {
    try {
        const response = await fetch('http://localhost:8080/api/stage-results');
        if (!response.ok) {
            throw new Error('Failed to fetch stage results');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching stage results:', error);
        return [];
    }
};

const fetchCyclists = async () => {
    try {
        const response = await fetch('http://localhost:8080/api/cyclists');
        if (!response.ok) {
            throw new Error('Failed to fetch cyclists');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching cyclists:', error);
        return [];
    }
}

export { fetchStageResults, fetchCyclists };