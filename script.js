async function getAndDisplayQuotes() {
    try {
        const querySnapshot = await db.collection('quotes').get();
        quotesContainer.innerHTML = ''; // Clear loading message

        if (querySnapshot.empty) {
            quotesContainer.innerHTML = '<p>No quotes found yet!</p>';
            return;
        }

        querySnapshot.forEach(doc => {
            const quote = doc.data();
            const quoteElement = document.createElement('div');
            quoteElement.classList.add('quote-item');
            quoteElement.innerHTML = `
                <p class="quote-text">"${quote.text}"</p>
                <p class="quote-author">- ${quote.author}</p>
            `;
            quotesContainer.appendChild(quoteElement);
        });
    } catch (error) {
        console.error("Error getting documents: ", error);
        quotesContainer.innerHTML = '<p>Error loading quotes. Please check the console.</p>';
    }
}

// Call the function to display quotes when the page loads
getAndDisplayQuotes();