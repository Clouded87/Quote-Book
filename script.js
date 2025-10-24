import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { firestoredb } from './main.js';

export async function getAndDisplayQuotes() {
    const quotesContainer = document.getElementById('quotes-container');
    const quotesContainer1 = document.getElementById('quotes-container1');
    try {
        const querySnapshot = await getDocs(collection(firestoredb, 'Quotes'));
        quotesContainer.innerHTML = ''; // Clear loading message

        if (querySnapshot.empty) {
            quotesContainer.innerHTML = '<p>No quotes found yet!</p>';
            return;
        }

        querySnapshot.forEach(doc => {
            const quote = doc.data();
            const quoteElement = document.createElement('div');
            quoteElement.classList.add('quote-item');
            
            // Add delete button for admin view
            const isAdminView = document.getElementById('admin-logged-in-view').style.display === 'block';
            const deleteButton = isAdminView ? `
                <button class="delete-btn" data-quote-id="${doc.id}">Delete</button>
            ` : '';
            
            quoteElement.innerHTML = `
                <div class="quote-content">
                    <p class="quote-text">"${quote.Text}"</p>
                    <p class="quote-author">- ${quote.Author}</p>
                </div>
                ${deleteButton}
            `;
            quotesContainer.appendChild(quoteElement);
            quotesContainer1.appendChild(quoteElement);
            
            // Add delete event listener if in admin view
            if (isAdminView) {
                const deleteBtn = quoteElement.querySelector('.delete-btn');
                deleteBtn.addEventListener('click', async () => {
                    if (confirm('Are you sure you want to delete this quote?')) {
                        await deleteQuote(doc.id);
                    }
                });
            }
        });
    } catch (error) {
        console.error("Error getting documents: ", error);
        quotesContainer.innerHTML = '<p>Error loading quotes. Please check the console.</p>';
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
