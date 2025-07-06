const parseJson = (rawResponse) => {
    const jsonString = rawResponse.replace(/```json|```/g, '').trim();

    let parsedResponse;
    try {
        parsedResponse = JSON.parse(jsonString)
    } catch (error) {
        console.error('Error parsing JSON:', error);
        return res.status(500).json({ error: 'Failed to parse response' });
    }
    return parsedResponse;
}

export {parseJson};