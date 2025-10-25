import { collection, getDocs, addDoc, deleteDoc, doc } from './node_modules/firebase/firestore';
import { firestoredb } from './main.js';

export async function getAndDisplayQuotes() {
    const quotesContainer = document.getElementById('quotes-container');
    const quotesContainer1 = document.getElementById('quotes-container1');
    try {
        const querySnapshot = await getDocs(collection(firestoredb, 'Quotes'));
        quotesContainer.innerHTML = ''; // Clear loading message
        quotesContainer1.innerHTML = ''; // Clear loading message
        if (querySnapshot.empty) {
            quotesContainer.innerHTML = '<p>No quotes found yet!</p>';
            quotesContainer1.innerHTML = '<p>No quotes found yet!</p>';
            return;
        }

        querySnapshot.forEach(doc => {
            const quote = doc.data();
            const quoteId = doc.id;

            // Is the current signed-in user in admin view? (used to decide whether admin element needs delete)
            const isAdminView = document.getElementById('admin-logged-in-view').style.display === 'block';

            // Helper to build a quote element. includeDelete adds the delete button and its handler.
            function buildQuoteElement(includeDelete) {
                const el = document.createElement('div');
                el.classList.add('quote-item');
                el.innerHTML = `
                    <div class="quote-content">
                        <p class="quote-text">"${quote.Text}"</p>
                        <p class="quote-author">- ${quote.Author}</p>
                    </div>
                    ${includeDelete ? `<button class="delete-btn" data-quote-id="${quoteId}">Delete</button>` : ''}
                `;

                if (includeDelete) {
                    const deleteBtn = el.querySelector('.delete-btn');
                    if (deleteBtn) {
                        deleteBtn.addEventListener('click', async () => {
                            if (confirm('Are you sure you want to delete this quote?')) {
                                await deleteQuote(quoteId);
                            }
                        });
                    }
                }

                return el;
            }

            // Create separate elements for admin and user views. Do NOT append the same node twice.
            const adminElement = buildQuoteElement(isAdminView);
            const userElement = buildQuoteElement(false);

            quotesContainer.appendChild(adminElement);
            quotesContainer1.appendChild(userElement);
        });
    } catch (error) {
        console.error("Error getting documents: ", error);
        quotesContainer.innerHTML = '<p>Error loading quotes. Please check the console.</p>';
        quotesContainer1.innerHTML = '<p>Error loading quotes. Please check the console.</p>';
    }
}

export async function addQuote(quoteText, author) {
    try {
        const docRef = await addDoc(collection(firestoredb, 'Quotes'), {
            Text: quoteText,
            Author: author
        });
        console.log("Quote added with ID: ", docRef.id);
        // Refresh the quotes display
        getAndDisplayQuotes();
        return true;
    } catch (error) {
        console.error("Error adding quote: ", error);
        return false;
    }
}

export async function deleteQuote(quoteId) {
    try {
        await deleteDoc(doc(firestoredb, 'Quotes', quoteId));
        console.log("Quote deleted successfully");
        // Refresh the quotes display
        getAndDisplayQuotes();
        return true;
    } catch (error) {
        console.error("Error deleting quote: ", error);
        alert('Failed to delete quote. Please try again.');
        return false;
    }
}

// Initialize add quote functionality
document.addEventListener('DOMContentLoaded', () => {
    const addQuoteBtn = document.querySelector('#quote-add-form .login-btn');
    const quoteTextInput = document.getElementById('quote-text-input');
    const authorInput = document.getElementById('author-input');

    if (addQuoteBtn) {
        addQuoteBtn.addEventListener('click', async () => {
            const quoteText = quoteTextInput.value.trim();
            const author = authorInput.value.trim();

            if (!quoteText || !author) {
                alert('Please fill in both the quote text and author fields');
                return;
            }

            const success = await addQuote(quoteText, author);
            if (success) {
                // Clear the form
                quoteTextInput.value = '';
                authorInput.value = '';
                alert('Quote added successfully!');
            } else {
                alert('Failed to add quote. Please try again.');
            }
        });
    }
});
