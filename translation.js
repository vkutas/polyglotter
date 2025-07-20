translationApiEndpoint = "https://translate.api.cloud.yandex.net/translate/v2/translate"

async function translateText(text) {

    let apiKeyPromise = await browser.storage.sync.get("apiKey");
    const apiKey = await apiKeyPromise.apiKey
    // console.log("API Key: ", apiKey)

    let folderIdPromise = await browser.storage.sync.get("folderId");
    const folderId = await folderIdPromise.folderId
    // console.log("folder ID: ", folderId)

    try {
        const response = await fetch(translationApiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Api-Key ${apiKey}`
            },
            body: JSON.stringify({
                folderId: folderId,
                targetLanguageCode: "ru",
                texts: [text]
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();

        // Return the first translation's text if input was a single string
        // Or return array of translations if input was an array
        if (Array.isArray(text)) {
            return data.translations.map(t => t.text);
        }
        return data.translations[0].text;

    } catch (error) {
        console.error('Translation error:', error);
        throw error; // Re-throw to allow caller to handle
    }
}