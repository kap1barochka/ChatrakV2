document.addEventListener('DOMContentLoaded', () => {
    const radioTable = document.getElementById('type-table');
    const radioTournament = document.getElementById('type-tournament');
    const tournamentFields = document.getElementById('tournament-fields');
    const title = document.getElementById('booking-title');
    const textarea = document.getElementById('main-textarea');
    const bookingForm = document.getElementById('booking-form');

    // База данных (Объект auth и firebase уже существуют благодаря script.js)
    const db = firebase.firestore();

    function updateForm() {
        if (radioTournament.checked) {
            tournamentFields.style.display = 'block';
            title.innerHTML = `${window.chatrakT ? window.chatrakT('Tournament registration') : 'Tournament registration'} <span>Grand Master Open</span>`;
            textarea.placeholder = window.chatrakT ? window.chatrakT("Tell us about your chess background or any special requirements.") : "Tell us about your chess background or any special requirements.";
        } else {
            tournamentFields.style.display = 'none';
            title.innerHTML = `${window.chatrakT ? window.chatrakT('booking') : 'booking'} <span>${window.chatrakT ? window.chatrakT('reserve a table') : 'reserve a table'}</span>`;
            textarea.placeholder = window.chatrakT ? window.chatrakT("Preferred date, time, and number of guests. Any special requests?") : "Preferred date, time, and number of guests. Any special requests?";
        }
    }

    radioTable.addEventListener('change', updateForm);
    radioTournament.addEventListener('change', updateForm);

    // ЛОГИКА ОТПРАВКИ В FIREBASE FIRESTORE
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault(); 

        if (!auth.currentUser) {
            alert(window.chatrakT ? window.chatrakT("Please Sign In to book a table or register for the tournament!") : "Please Sign In to book a table or register for the tournament!");
            document.getElementById('auth-modal').style.display = 'flex';
            return; 
        }

        const submitBtn = bookingForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerText;
        submitBtn.innerText = window.chatrakT ? window.chatrakT("Sending...") : "Sending...";
        submitBtn.disabled = true;

        const inputs = bookingForm.querySelectorAll('input.box');
        const fullName = inputs[0].value;
        const email = inputs[1].value;
        const phone = inputs[2].value;
        
        const isTournament = radioTournament.checked;
        const titleSelect = document.querySelector('#tournament-fields select').value;
        const elo = document.querySelectorAll('#tournament-fields input')[0].value;
        const message = textarea.value;

        db.collection("bookings").add({
            userId: auth.currentUser.uid,
            type: isTournament ? "Tournament Registration" : "Table Reservation",
            fullName: fullName,
            email: email,
            phone: phone,
            tournamentTitle: isTournament ? titleSelect : "N/A",
            elo: isTournament ? elo : "N/A",
            message: message,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(() => {
            const userDisplayName = auth.currentUser.displayName || fullName;
            const successBox = document.getElementById('booking-success');
            if (successBox) {
                successBox.innerHTML = `<i class="fas fa-check-circle"></i> ${window.ChatrakI18n && window.ChatrakI18n.currentLang() === 'ru' ? `Спасибо, ${userDisplayName}! Ваша заявка успешно отправлена.` : window.ChatrakI18n && window.ChatrakI18n.currentLang() === 'hy' ? `Շնորհակալություն, ${userDisplayName}։ Ձեր հայտը հաջողությամբ ուղարկվել է։` : `Thank you, ${userDisplayName}! Your request has been successfully submitted.`}`;
                successBox.style.display = 'block';
            }
            bookingForm.reset(); 
            updateForm(); 
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
            alert(window.chatrakT ? window.chatrakT("Unable to submit the request right now. Please try again.") : "Unable to submit the request right now. Please try again.");
        })
        .finally(() => {
            submitBtn.innerText = originalBtnText;
            submitBtn.disabled = false;
        });
    });

    // Автозаполнение
    auth.onAuthStateChanged((user) => {
        if (user) {
            const inputs = bookingForm.querySelectorAll('input.box');
            if (user.displayName) inputs[0].value = user.displayName; 
            if (user.email) inputs[1].value = user.email;
        }
    });

    const urlParams = new URLSearchParams(window.location.search);
    if(urlParams.get('type') === 'tournament') {
        radioTournament.checked = true;
        updateForm();
    }


    document.addEventListener('chatrak:languagechange', updateForm);

});