/* ==========================================================
   Chatrak multilingual system: EN / RU / HY
   Works without build tools and keeps the selected language
   across every page through localStorage.
========================================================== */
(function () {
    'use strict';

    const STORAGE_KEY = 'chatrak_language';
    const FALLBACK_LANG = 'en';
    const LANGS = {
        en: { label: 'EN', name: 'English' },
        ru: { label: 'RU', name: 'Русский' },
        hy: { label: 'ՀՅ', name: 'Հայերեն' }
    };

    const DICT = {
        // Navigation / repeated UI
        'Chatrak': { ru: 'Chatrak', hy: 'Chatrak' },
        'Home': { ru: 'Главная', hy: 'Գլխավոր' },
        'home': { ru: 'главная', hy: 'գլխավոր' },
        'Shop': { ru: 'Магазин', hy: 'Խանութ' },
        'Store': { ru: 'Магазин', hy: 'Խանութ' },
        'About': { ru: 'О нас', hy: 'Մեր մասին' },
        'about': { ru: 'о нас', hy: 'մեր մասին' },
        'News': { ru: 'Новости', hy: 'Նորություններ' },
        'Book': { ru: 'Бронь', hy: 'Ամրագրում' },
        'Games': { ru: 'Игры', hy: 'Խաղեր' },
        'Places': { ru: 'Места', hy: 'Վայրեր' },
        'Sign In': { ru: 'Войти', hy: 'Մուտք' },
        'Exit': { ru: 'Выйти', hy: 'Ելք' },
        'Close': { ru: 'Закрыть', hy: 'Փակել' },
        'Login': { ru: 'Войти', hy: 'Մուտք գործել' },
        'Sign Up': { ru: 'Регистрация', hy: 'Գրանցվել' },
        "Don't have an account?": { ru: 'Нет аккаунта?', hy: 'Դեռ հաշիվ չունե՞ք։' },
        'Already have an account?': { ru: 'Уже есть аккаунт?', hy: 'Արդեն հաշիվ ունե՞ք։' },
        'Enter your credentials to continue': { ru: 'Введите данные, чтобы продолжить', hy: 'Մուտքագրեք տվյալները՝ շարունակելու համար' },
        'Welcome back, chess master!': { ru: 'С возвращением, шахматный мастер!', hy: 'Բարի վերադարձ, շախմատի վարպետ։' },
        'Join the ultimate chess community!': { ru: 'Присоединяйтесь к шахматному сообществу!', hy: 'Միացեք շախմատային համայնքին։' },
        'Register': { ru: 'Зарегистрироваться', hy: 'Գրանցվել' },
        'Your Full Name': { ru: 'Ваше полное имя', hy: 'Ձեր լրիվ անունը' },
        'Full Name': { ru: 'Полное имя', hy: 'Լրիվ անուն' },
        'Email Address': { ru: 'Адрес эл. почты', hy: 'Էլ. փոստի հասցե' },
        'Password': { ru: 'Пароль', hy: 'Գաղտնաբառ' },
        'Phone Number': { ru: 'Номер телефона', hy: 'Հեռախոսահամար' },
        'Delivery Address': { ru: 'Адрес доставки', hy: 'Առաքման հասցե' },
        'Comment or preferred delivery time': { ru: 'Комментарий или удобное время доставки', hy: 'Մեկնաբանություն կամ նախընտրելի առաքման ժամ' },
        'created by': { ru: 'создано', hy: 'ստեղծել է' },
        '| all rights reserved': { ru: '| все права защищены', hy: '| բոլոր իրավունքները պաշտպանված են' },
        'quick links': { ru: 'быстрые ссылки', hy: 'արագ հղումներ' },
        'Quick Links': { ru: 'Быстрые ссылки', hy: 'Արագ հղումներ' },
        'contact info': { ru: 'контакты', hy: 'կոնտակտներ' },
        'Contact Info': { ru: 'Контакты', hy: 'Կոնտակտներ' },
        'social info': { ru: 'соцсети', hy: 'սոցցանցեր' },
        'our branches': { ru: 'наши филиалы', hy: 'մեր մասնաճյուղերը' },
        'Armenia': { ru: 'Армения', hy: 'Հայաստան' },
        'Russia': { ru: 'Россия', hy: 'Ռուսաստան' },
        'USA': { ru: 'США', hy: 'ԱՄՆ' },
        'India': { ru: 'Индия', hy: 'Հնդկաստան' },
        'Yerevan, Armenia': { ru: 'Ереван, Армения', hy: 'Երևան, Հայաստան' },
        'facebook': { ru: 'facebook', hy: 'facebook' },
        'instagram': { ru: 'instagram', hy: 'instagram' },

        // Home page
        'Everything related to chess': { ru: 'Всё, что связано с шахматами', hy: 'Ամեն ինչ շախմատի մասին' },
        'Join Tournament': { ru: 'Участвовать в турнире', hy: 'Մասնակցել մրցաշարին' },
        'Play Puzzle': { ru: 'Решить задачу', hy: 'Լուծել խնդիր' },
        'About Us': { ru: 'О нас', hy: 'Մեր մասին' },
        'The Chatrak Legacy': { ru: 'Наследие Chatrak', hy: 'Chatrak-ի ժառանգությունը' },
        "What's Make Our Game Special!": { ru: 'Что делает нашу игру особенной!', hy: 'Ինչն է մեր խաղը դարձնում առանձնահատուկ' },
        'Chatrak started with a deep passion for chess not just as a game, but as the highest form of craftsmanship. We believe that every match deserves a proper setting, and every piece is a small sculpture with its own soul.': { ru: 'Chatrak начался с глубокой любви к шахматам — не только как к игре, но и как к высшей форме мастерства. Мы верим, что каждая партия заслуживает достойной обстановки, а каждая фигура — это маленькая скульптура со своей душой.', hy: 'Chatrak-ը ծնվեց շախմատի հանդեպ խոր սիրուց՝ ոչ միայն որպես խաղի, այլև որպես բարձրագույն վարպետության ձևի։ Մենք հավատում ենք, որ յուրաքանչյուր պարտիա արժանի է գեղեցիկ միջավայրի, իսկ յուրաքանչյուր ֆիգուր փոքր քանդակ է իր հոգով։' },
        'Today, our collection includes everything from strict Staunton tournament sets to exotic elm burl and ebony boards brought from all over the world.': { ru: 'Сегодня наша коллекция включает всё: от строгих турнирных наборов Staunton до экзотических досок из капа вяза и эбена со всего мира.', hy: 'Այսօր մեր հավաքածուն ներառում է ամեն ինչ՝ խիստ Staunton մրցաշարային հավաքածուներից մինչև աշխարհի տարբեր վայրերից բերված էկզոտիկ կապավոր վյազի և էբենոսի տախտակներ։' },
        'Read More': { ru: 'Подробнее', hy: 'Կարդալ ավելին' },
        '01. The Origin': { ru: '01. Истоки', hy: '01. Ծագումը' },
        '02. Noble Woods': { ru: '02. Благородная древесина', hy: '02. Ազնիվ փայտեր' },
        '03. Master Craft': { ru: '03. Мастерская работа', hy: '03. Վարպետություն' },
        '04. The 1849 Legacy': { ru: '04. Наследие 1849 года', hy: '04. 1849-ի ժառանգությունը' },
        'Back': { ru: 'Назад', hy: 'Հետ' },
        'The Soul of the Game': { ru: 'Душа игры', hy: 'Խաղի հոգին' },
        'Chatrak is not just a store; it is a sanctuary for the royal game. We believe that chess is the ultimate intersection of art, history, and human intellect. Every match deserves a proper setting, and every piece is a small sculpture with its own history.': { ru: 'Chatrak — это не просто магазин, а пространство для королевской игры. Мы верим, что шахматы объединяют искусство, историю и человеческий интеллект. Каждая партия заслуживает достойной обстановки, а каждая фигура — маленькая скульптура со своей историей.', hy: 'Chatrak-ը պարզապես խանութ չէ, այլ թագավորական խաղի սրբավայր։ Մենք հավատում ենք, որ շախմատը արվեստի, պատմության և մարդկային մտքի բարձրագույն հատման կետն է։ Յուրաքանչյուր պարտիա արժանի է արժանապատիվ միջավայրի, իսկ յուրաքանչյուր ֆիգուր փոքր քանդակ է իր պատմությամբ։' },
        "Nature's Finest Canvas": { ru: 'Лучшее полотно природы', hy: 'Բնության լավագույն կտավը' },
        'We refuse to use synthetic stains. The rich blacks, deep reds, and golden browns of our sets are 100% natural. From the dense African Padauk to the mesmerizing chaos of Elm Burl, our materials are selected for their weight, texture, and aroma.': { ru: 'Мы не используем синтетические морилки. Глубокие чёрные, насыщенные красные и золотисто-коричневые оттенки наших наборов полностью натуральны. От плотного африканского падука до выразительного капа вяза — материалы выбираются по весу, фактуре и аромату.', hy: 'Մենք չենք օգտագործում արհեստական ներկանյութեր։ Մեր հավաքածուների խորը սև, հագեցած կարմիր և ոսկեգորշ երանգները լիովին բնական են։ Խիտ աֆրիկյան պադուկից մինչև վյազի կապի անկրկնելի նախշերը՝ նյութերն ընտրվում են ըստ քաշի, հյուսվածքի և բույրի։' },
        'Hand-Carved Perfection': { ru: 'Совершенство ручной резьбы', hy: 'Ձեռքով փորագրված կատարելություն' },
        'While pawns and rooks are turned on a precision lathe, the Knight is the soul of the set. Our Knights are meticulously hand-carved by master artisans. A single highly detailed piece can take hours to perfect before being triple-weighted for balance.': { ru: 'Пешки и ладьи вытачиваются на точном станке, но конь — душа набора. Наши кони тщательно вырезаются вручную мастерами. На одну детализированную фигуру могут уходить часы, прежде чем её утяжелят для идеального баланса.', hy: 'Մինչ զինվորներն ու նավակները մշակվում են ճշգրիտ խառատային հաստոցով, ձին հավաքածուի հոգին է։ Մեր ձիերը մանրակրկիտ փորագրվում են ձեռքով՝ վարպետների կողմից։ Մեկ մանրամասն ֆիգուրի կատարելագործումը կարող է ժամեր տևել, նախքան այն հավասարակշռության համար ծանրացվի։' },
        'Preserving History': { ru: 'Сохраняя историю', hy: 'Պահպանելով պատմությունը' },
        'The pride of our collection lies in our historical replicas. We recreate the iconic 1849 Staunton designs, preserving historical accuracy in every curve and bevel. Playing with these pieces is like holding a piece of history in your hands.': { ru: 'Гордость нашей коллекции — исторические реплики. Мы воссоздаём культовый дизайн Staunton 1849 года, сохраняя точность каждой линии и фаски. Играть такими фигурами — значит держать в руках часть истории.', hy: 'Մեր հավաքածուի հպարտությունը պատմական կրկնօրինակներն են։ Մենք վերաստեղծում ենք 1849 թվականի խորհրդանշական Staunton դիզայնը՝ պահպանելով պատմական ճշգրտությունը յուրաքանչյուր գծի և եզրի մեջ։ Այս ֆիգուրներով խաղալը պատմության մի կտոր ձեռքում պահել է։' },
        'Exclusive': { ru: 'Эксклюзивные', hy: 'Բացառիկ' },
        'Products': { ru: 'Товары', hy: 'Ապրանքներ' },
        'reviews': { ru: 'отзывы', hy: 'կարծիքներ' },
        'what people says': { ru: 'что говорят люди', hy: 'ինչ են ասում մարդիկ' },
        'satisfied client': { ru: 'довольный клиент', hy: 'գոհ հաճախորդ' },
        'new client': { ru: 'новый клиент', hy: 'նոր հաճախորդ' },
        'Leave your review': { ru: 'Оставьте отзыв', hy: 'Թողեք ձեր կարծիքը' },
        'Your Name': { ru: 'Ваше имя', hy: 'Ձեր անունը' },
        'Your Message': { ru: 'Ваше сообщение', hy: 'Ձեր հաղորդագրությունը' },
        'Clear My Reviews': { ru: 'Очистить мои отзывы', hy: 'Մաքրել իմ կարծիքները' },
        'Publish Review': { ru: 'Опубликовать отзыв', hy: 'Հրապարակել կարծիքը' },
        'Please fill in all fields!': { ru: 'Пожалуйста, заполните все поля!', hy: 'Խնդրում ենք լրացնել բոլոր դաշտերը։' },
        'Thank you for your review!': { ru: 'Спасибо за ваш отзыв!', hy: 'Շնորհակալություն կարծիքի համար։' },
        'Are you sure you want to delete all your reviews?': { ru: 'Вы уверены, что хотите удалить все свои отзывы?', hy: 'Վստա՞հ եք, որ ցանկանում եք ջնջել ձեր բոլոր կարծիքները։' },
        'Account created successfully!': { ru: 'Аккаунт успешно создан!', hy: 'Հաշիվը հաջողությամբ ստեղծվեց։' },
        'Error: Invalid email or password.': { ru: 'Ошибка: неверная почта или пароль.', hy: 'Սխալ․ էլ. փոստը կամ գաղտնաբառը սխալ է։' },

        // Shop
        'Chatrak | Store': { ru: 'Chatrak | Магазин', hy: 'Chatrak | Խանութ' },
        'take home a piece of history': { ru: 'возьмите домой частицу истории', hy: 'տուն տարեք պատմության մի կտոր' },
        'Specializing in fine chess products': { ru: 'Специализация на качественных шахматных товарах', hy: 'Մասնագիտանում ենք բարձրորակ շախմատային ապրանքներում' },
        'Shipping & FAQ': { ru: 'Доставка и FAQ', hy: 'Առաքում և FAQ' },
        'Chess Pieces': { ru: 'Шахматные фигуры', hy: 'Շախմատի ֆիգուրներ' },
        'Wood, Plastic, Metal & More': { ru: 'Дерево, пластик, металл и другое', hy: 'Փայտ, պլաստիկ, մետաղ և ավելին' },
        'Chess': { ru: 'Шахматы', hy: 'Շախմատ' },
        'Sets': { ru: 'Наборы', hy: 'Հավաքածուներ' },
        'Wood, Plastic, Metal, Theme & More': { ru: 'Дерево, пластик, металл, тематические и другие', hy: 'Փայտ, պլաստիկ, մետաղ, թեմատիկ և ավելին' },
        'Chess Boards': { ru: 'Шахматные доски', hy: 'Շախմատի տախտակներ' },
        'Wood, Vinyl Rollup, Floppy & More': { ru: 'Дерево, винил, мягкие доски и другое', hy: 'Փայտ, վինիլ, փափուկ տախտակներ և ավելին' },
        'Chess Supplies': { ru: 'Шахматные аксессуары', hy: 'Շախմատային պարագաներ' },
        'Wood Chess Boxes': { ru: 'Деревянные коробки для шахмат', hy: 'Փայտե շախմատային տուփեր' },
        'Chess Computers': { ru: 'Шахматные компьютеры', hy: 'Շախմատային համակարգիչներ' },
        'Chess Clocks': { ru: 'Шахматные часы', hy: 'Շախմատային ժամացույցներ' },
        'Bags': { ru: 'Сумки', hy: 'Պայուսակներ' },
        'Add to Cart': { ru: 'В корзину', hy: 'Ավելացնել զամբյուղ' },
        'Search items...': { ru: 'Искать товары...', hy: 'Որոնել ապրանքներ...' },
        'No items found': { ru: 'Товары не найдены', hy: 'Ապրանքներ չեն գտնվել' },
        'FAQ & Shipping': { ru: 'FAQ и доставка', hy: 'FAQ և առաքում' },
        'How much does shipping cost and how long does it take?': { ru: 'Сколько стоит доставка и сколько она занимает?', hy: 'Որքա՞ն արժե առաքումը և որքան է տևում։' },
        'We offer free next-day delivery for all orders within Yerevan. For other regions across Armenia, a standard flat-rate delivery time is 2-3 business days. International shipping takes 7-14 days.': { ru: 'По Еревану мы предлагаем бесплатную доставку на следующий день. В другие регионы Армении доставка по стандартному тарифу занимает 2–3 рабочих дня. Международная доставка занимает 7–14 дней.', hy: 'Երևանում բոլոր պատվերների համար առաջարկում ենք անվճար առաքում հաջորդ օրը։ Հայաստանի մյուս մարզերում ստանդարտ առաքումը տևում է 2–3 աշխատանքային օր։ Միջազգային առաքումը տևում է 7–14 օր։' },
        'Your Cart': { ru: 'Ваша корзина', hy: 'Ձեր զամբյուղը' },
        'Your cart is currently empty.': { ru: 'Ваша корзина пока пуста.', hy: 'Ձեր զամբյուղը դեռ դատարկ է։' },
        'Total: $': { ru: 'Итого: $', hy: 'Ընդամենը՝ $' },
        'Proceed to Checkout': { ru: 'Перейти к оформлению', hy: 'Անցնել ձևակերպմանը' },
        'Checkout': { ru: 'Оформление заказа', hy: 'Պատվերի ձևակերպում' },
        'Complete your order request and our team will contact you.': { ru: 'Заполните заявку, и наша команда свяжется с вами.', hy: 'Լրացրեք պատվերի հայտը, և մեր թիմը կապ կհաստատի ձեզ հետ։' },
        'Order Total: $': { ru: 'Сумма заказа: $', hy: 'Պատվերի գումար՝ $' },
        'Confirm Order': { ru: 'Подтвердить заказ', hy: 'Հաստատել պատվերը' },
        'Your basket is empty! Add some items first.': { ru: 'Корзина пуста! Сначала добавьте товары.', hy: 'Զամբյուղը դատարկ է։ Նախ ավելացրեք ապրանքներ։' },
        'Please complete all required order fields.': { ru: 'Пожалуйста, заполните все обязательные поля заказа.', hy: 'Խնդրում ենք լրացնել պատվերի բոլոր պարտադիր դաշտերը։' },
        'Your order request has been successfully submitted. Chatrak team will contact you soon.': { ru: 'Ваша заявка успешно отправлена. Команда Chatrak скоро свяжется с вами.', hy: 'Ձեր պատվերի հայտը հաջողությամբ ուղարկվել է։ Chatrak-ի թիմը շուտով կապ կհաստատի ձեզ հետ։' },

        // Booking
        'Chatrak | Booking & Registration': { ru: 'Chatrak | Бронь и регистрация', hy: 'Chatrak | Ամրագրում և գրանցում' },
        'booking': { ru: 'бронь', hy: 'ամրագրում' },
        'reserve a table': { ru: 'забронировать стол', hy: 'ամրագրել սեղան' },
        'Reserve Table': { ru: 'Забронировать стол', hy: 'Ամրագրել սեղան' },
        'Tournament Entry': { ru: 'Заявка на турнир', hy: 'Գրանցում մրցաշարին' },
        'Select Tournament Title (Optional)': { ru: 'Выберите шахматное звание (необязательно)', hy: 'Ընտրեք շախմատային կոչումը (պարտադիր չէ)' },
        'National Master (NM)': { ru: 'Национальный мастер (NM)', hy: 'Ազգային վարպետ (NM)' },
        'FIDE Master (FM)': { ru: 'Мастер ФИДЕ (FM)', hy: 'ՖԻԴԵ վարպետ (FM)' },
        'International Master (IM)': { ru: 'Международный мастер (IM)', hy: 'Միջազգային վարպետ (IM)' },
        'Grandmaster (GM)': { ru: 'Гроссмейстер (GM)', hy: 'Գրոսմայստեր (GM)' },
        'No Official Title': { ru: 'Без официального звания', hy: 'Առանց պաշտոնական կոչման' },
        'Send Request': { ru: 'Отправить заявку', hy: 'Ուղարկել հայտը' },
        'Current FIDE ELO Rating (if any)': { ru: 'Текущий рейтинг FIDE ELO (если есть)', hy: 'Ընթացիկ FIDE ELO վարկանիշը (եթե կա)' },
        'Message (Or preferred date and time for table reservation)': { ru: 'Сообщение (или желаемые дата и время брони стола)', hy: 'Հաղորդագրություն (կամ սեղանի ամրագրման նախընտրելի օրն ու ժամը)' },
        'Please fill in Name, Email and Phone fields.': { ru: 'Пожалуйста, заполните имя, почту и телефон.', hy: 'Խնդրում ենք լրացնել անունը, էլ. փոստը և հեռախոսը։' },
        'Your request has been saved. We will contact you soon!': { ru: 'Ваша заявка сохранена. Мы скоро свяжемся с вами!', hy: 'Ձեր հայտը պահպանվել է։ Մենք շուտով կապ կհաստատենք։' },
        'Unable to save request. Please try again later.': { ru: 'Не удалось сохранить заявку. Попробуйте позже.', hy: 'Չհաջողվեց պահպանել հայտը։ Փորձեք ավելի ուշ։' },
        'Tell us about your chess background or any special requirements.': { ru: 'Расскажите о своём шахматном опыте или особых требованиях.', hy: 'Պատմեք ձեր շախմատային փորձի կամ հատուկ պահանջների մասին։' },
        'Preferred date, time, and number of guests. Any special requests?': { ru: 'Желаемые дата, время и количество гостей. Есть особые пожелания?', hy: 'Նախընտրելի ամսաթիվը, ժամը և հյուրերի քանակը։ Կա՞ն հատուկ ցանկություններ։' },
        'Please Sign In to book a table or register for the tournament!': { ru: 'Пожалуйста, войдите, чтобы забронировать стол или зарегистрироваться на турнир!', hy: 'Խնդրում ենք մուտք գործել՝ սեղան ամրագրելու կամ մրցաշարին գրանցվելու համար։' },
        'Sending...': { ru: 'Отправка...', hy: 'Ուղարկվում է...' },
        'Unable to submit the request right now. Please try again.': { ru: 'Сейчас не удалось отправить заявку. Попробуйте ещё раз.', hy: 'Այս պահին չհաջողվեց ուղարկել հայտը։ Փորձեք կրկին։' },
        'Reservation request': { ru: 'Заявка на бронь', hy: 'Ամրագրման հայտ' },
        'Tournament registration': { ru: 'Регистрация на турнир', hy: 'Գրանցում մրցաշարին' },

        // Game
        'Play Chess Mini-Game': { ru: 'Играть в шахматную мини-игру', hy: 'Խաղալ շախմատային մինի խաղ' },
        'Classic Game': { ru: 'Классическая игра', hy: 'Դասական խաղ' },
        'Play a standard chess game against the computer.': { ru: 'Сыграйте стандартную шахматную партию против компьютера.', hy: 'Խաղացեք դասական շախմատային պարտիա համակարգչի դեմ։' },
        'Restart Game': { ru: 'Начать заново', hy: 'Սկսել նորից' },
        'Random Puzzle': { ru: 'Случайная задача', hy: 'Պատահական խնդիր' },
        'Hint': { ru: 'Подсказка', hy: 'Հուշում' },
        'Mode:': { ru: 'Режим:', hy: 'Ռեժիմ՝' },
        'Turn:': { ru: 'Ход:', hy: 'Քայլ՝' },
        'White': { ru: 'Белые', hy: 'Սպիտակներ' },
        'Black': { ru: 'Чёрные', hy: 'Սևեր' },
        'Status:': { ru: 'Статус:', hy: 'Կարգավիճակ՝' },
        'Ready to play': { ru: 'Готово к игре', hy: 'Պատրաստ է խաղին' },
        'Last Move:': { ru: 'Последний ход:', hy: 'Վերջին քայլը՝' },
        'Game in progress': { ru: 'Игра продолжается', hy: 'Խաղը ընթացքի մեջ է' },
        'Checkmate': { ru: 'Мат', hy: 'Մատ' },
        'Stalemate': { ru: 'Пат', hy: 'Պատ' },
        'Draw': { ru: 'Ничья', hy: 'Ոչ-ոքի' },
        'is in check': { ru: 'под шахом', hy: 'շախի տակ է' },
        'Puzzle Mode': { ru: 'Режим задачи', hy: 'Խնդրի ռեժիմ' },
        'Move accepted': { ru: 'Ход принят', hy: 'Քայլն ընդունվեց' },
        'Puzzle solved': { ru: 'Задача решена', hy: 'Խնդիրը լուծված է' },
        'Find the best move': { ru: 'Найдите лучший ход', hy: 'Գտեք լավագույն քայլը' },
        'System answered': { ru: 'Ответ системы', hy: 'Համակարգի պատասխանը' },
        'Mate In 2': { ru: 'Мат в 2 хода', hy: 'Մատ 2 քայլում' },
        'Mate In 1': { ru: 'Мат в 1 ход', hy: 'Մատ 1 քայլում' },
        'White to move and win. Find the brilliant queen sacrifice played by Mikhail Tal.': { ru: 'Ход белых и победа. Найдите блестящую жертву ферзя в стиле Михаила Таля.', hy: 'Սպիտակների քայլն է և հաղթանակ։ Գտեք Միխայիլ Տալի ոճով փայլուն թագուհու զոհաբերությունը։' },
        'Hint: Look at the f7 square! The Queen is ready to strike.': { ru: 'Подсказка: посмотрите на поле f7! Ферзь готов нанести удар.', hy: 'Հուշում․ նայեք f7 դաշտին։ Թագուհին պատրաստ է հարվածի։' },
        "White to move. The Black King is trapped. Find the classic 'Back Rank' checkmate.": { ru: 'Ход белых. Чёрный король в ловушке. Найдите классический мат по последней горизонтали.', hy: 'Սպիտակների քայլն է։ Սևերի արքան փակված է։ Գտեք դասական մատը վերջին շարքում։' },
        'Hint: Use your Rook to attack the 8th rank.': { ru: 'Подсказка: используйте ладью для атаки 8-й горизонтали.', hy: 'Հուշում․ օգտագործեք նավակը 8-րդ շարքը գրոհելու համար։' },
        "Black to move. White's King is cornered. Deliver the final blow with your Queen!": { ru: 'Ход чёрных. Белый король загнан в угол. Нанесите финальный удар ферзём!', hy: 'Սևերի քայլն է։ Սպիտակների արքան անկյունում է։ Վերջնական հարվածը հասցրեք թագուհով։' },
        'Hint: Move the Queen closer to the White King.': { ru: 'Подсказка: подведите ферзя ближе к белому королю.', hy: 'Հուշում․ մոտեցրեք թագուհուն սպիտակ արքային։' },
        'Brilliant! You solved the puzzle and delivered checkmate!': { ru: 'Блестяще! Вы решили задачу и поставили мат!', hy: 'Փայլուն է։ Դուք լուծեցիք խնդիրը և մատ դրեցիք։' },
        'Мат! Отличная игра.': { ru: 'Мат! Отличная игра.', hy: 'Մատ։ Հիանալի խաղ էր։' },
        'Ничья!': { ru: 'Ничья!', hy: 'Ոչ-ոքի։' },

        // Map
        'Chess Places': { ru: 'Шахматные места', hy: 'Շախմատային վայրեր' },
        'Spots': { ru: 'Точки', hy: 'Վայրեր' },
        'Find a place to play, practice, or buy equipment near you.': { ru: 'Найдите место рядом с вами, где можно играть, тренироваться или купить инвентарь.', hy: 'Գտեք մոտակայքում վայր՝ խաղալու, մարզվելու կամ պարագաներ գնելու համար։' },
        'Show All Places': { ru: 'Показать все места', hy: 'Ցույց տալ բոլոր վայրերը' },
        'Tigran Petrosian Chess House': { ru: 'Дом шахмат имени Тиграна Петросяна', hy: 'Տիգրան Պետրոսյանի անվան շախմատի տուն' },
        'Главный шахматный центр в Ереване. Место проведения турниров.': { ru: 'Главный шахматный центр в Ереване. Место проведения турниров.', hy: 'Երևանի գլխավոր շախմատային կենտրոնը և մրցաշարերի անցկացման վայր։', en: 'The main chess center in Yerevan and a venue for tournaments.' },
        'Chatrak Official Store': { ru: 'Официальный магазин Chatrak', hy: 'Chatrak պաշտոնական խանութ' },
        'Наш главный магазин в Ереване. Лучшие шахматные доски и наборы.': { ru: 'Наш главный магазин в Ереване. Лучшие шахматные доски и наборы.', hy: 'Մեր գլխավոր խանութը Երևանում՝ լավագույն շախմատային տախտակներով և հավաքածուներով։', en: 'Our main store in Yerevan with the best chess boards and sets.' },
        "Lovers' Park (Ереван)": { ru: 'Парк влюблённых (Ереван)', hy: 'Սիրահարների այգի (Երևան)', en: "Lovers' Park (Yerevan)" },
        'Прекрасный парк, где молодежь и старшее поколение часто играют в шахматы на свежем воздухе.': { ru: 'Прекрасный парк, где молодежь и старшее поколение часто играют в шахматы на свежем воздухе.', hy: 'Գեղեցիկ այգի, որտեղ երիտասարդներն ու ավագ սերունդը հաճախ բացօթյա շախմատ են խաղում։', en: 'A beautiful park where young and older players often enjoy outdoor chess.' },
        'Tsaghkadzor Sports Complex': { ru: 'Спортивный комплекс Цахкадзора', hy: 'Ծաղկաձորի մարզահամալիր' },
        'В Цахкадзоре регулярно проходят крупные международные и командные чемпионаты по шахматам.': { ru: 'В Цахкадзоре регулярно проходят крупные международные и командные чемпионаты по шахматам.', hy: 'Ծաղկաձորում պարբերաբար անցկացվում են խոշոր միջազգային և թիմային շախմատային առաջնություններ։', en: 'Tsaghkadzor regularly hosts major international and team chess championships.' },
        'Gyumri Chess School': { ru: 'Гюмрийская шахматная школа', hy: 'Գյումրիի շախմատի դպրոց' },
        'Шахматная школа в культурной столице Армении, воспитавшая многих гроссмейстеров.': { ru: 'Шахматная школа в культурной столице Армении, воспитавшая многих гроссмейстеров.', hy: 'Հայաստանի մշակութային մայրաքաղաքի շախմատի դպրոց, որը դաստիարակել է բազմաթիվ գրոսմայստերների։', en: 'A chess school in Armenia’s cultural capital that has trained many grandmasters.' },
        'Sevan Lakeside Pavilion': { ru: 'Павильон у озера Севан', hy: 'Սևանի լճափնյա տաղավար' },
        'Идеальное место для спокойной игры в шахматы с видом на озеро Севан.': { ru: 'Идеальное место для спокойной игры в шахматы с видом на озеро Севан.', hy: 'Իդեալական վայր Սևանա լճի տեսարանով հանգիստ շախմատ խաղալու համար։', en: 'An ideal place for a calm chess game with a view of Lake Sevan.' },
        'Dilijan Chess Retreat': { ru: 'Шахматный ретрит в Дилижане', hy: 'Դիլիջանի շախմատային հանգրվան' },
        'Интеллектуальные лагеря и шахматные сборы в лесах Дилижана.': { ru: 'Интеллектуальные лагеря и шахматные сборы в лесах Дилижана.', hy: 'Ինտելեկտուալ ճամբարներ և շախմատային հավաքներ Դիլիջանի անտառներում։', en: 'Intellectual camps and chess training retreats in Dilijan’s forests.' },
        'Yerevan Chess Academy': { ru: 'Ереванская шахматная академия', hy: 'Երևանի շախմատի ակադեմիա' },
        'Учебный центр для шахматистов разных возрастов и уровней подготовки.': { ru: 'Учебный центр для шахматистов разных возрастов и уровней подготовки.', hy: 'Ուսումնական կենտրոն տարբեր տարիքի և մակարդակի շախմատիստների համար։', en: 'A training center for chess players of different ages and skill levels.' },
        'Vanadzor Chess Club': { ru: 'Ванадзорский шахматный клуб', hy: 'Վանաձորի շախմատային ակումբ' },
        'Шахматное пространство в Лорийской области для занятий и клубных встреч.': { ru: 'Шахматное пространство в Лорийской области для занятий и клубных встреч.', hy: 'Շախմատային տարածք Լոռու մարզում՝ դասերի և ակումբային հանդիպումների համար։', en: 'A chess space in Lori Province for lessons and club meetings.' },

        // News
        'Chatrak | Chess Chronicle': { ru: 'Chatrak | Шахматная хроника', hy: 'Chatrak | Շախմատային քրոնիկոն' },
        'The Chatrak': { ru: 'Chatrak', hy: 'Chatrak' },
        'Chronicle': { ru: 'Хроника', hy: 'Քրոնիկոն' },
        'Your ultimate source for modern tournaments, player psychology, and the evolution of the game.': { ru: 'Ваш главный источник о современных турнирах, психологии игроков и развитии игры.', hy: 'Ձեր հիմնական աղբյուրը ժամանակակից մրցաշարերի, խաղացողների հոգեբանության և խաղի զարգացման մասին։' },
        'Official Chatrak Event': { ru: 'Официальное событие Chatrak', hy: 'Chatrak-ի պաշտոնական միջոցառում' },
        'The Chatrak Grand Master Open 2026': { ru: 'Chatrak Grand Master Open 2026', hy: 'Chatrak Grand Master Open 2026' },
        'Join the most prestigious chess tournament of the year in Armenia. Face off against the best minds, win exclusive Chatrak crafted sets, and claim your share of the ֏4,000,000 prize pool. Limited seats available.': { ru: 'Присоединяйтесь к самому престижному шахматному турниру года в Армении. Сразитесь с сильнейшими умами, выиграйте эксклюзивные наборы Chatrak и получите часть призового фонда ֏4,000,000. Количество мест ограничено.', hy: 'Միացեք տարվա ամենահեղինակավոր շախմատային մրցաշարին Հայաստանում։ Մրցեք լավագույն մտքերի հետ, շահեք Chatrak-ի բացառիկ հավաքածուներ և ստացեք ֏4,000,000 մրցանակային ֆոնդի ձեր մասը։ Տեղերը սահմանափակ են։' },
        'August 15-20, 2026': { ru: '15–20 августа 2026', hy: '2026 թ. օգոստոսի 15–20' },
        '֏4,000,000 Prize Pool': { ru: 'Призовой фонд ֏4,000,000', hy: '֏4,000,000 մրցանակային ֆոնդ' },
        'Register Now': { ru: 'Зарегистрироваться', hy: 'Գրանցվել հիմա' },
        'All News': { ru: 'Все новости', hy: 'Բոլոր նորությունները' },
        'Tournaments': { ru: 'Турниры', hy: 'Մրցաշարեր' },
        'Grandmasters': { ru: 'Гроссмейстеры', hy: 'Գրոսմայստերներ' },
        'Science & AI': { ru: 'Наука и ИИ', hy: 'Գիտություն և ԱԲ' },
        'April 18, 2026 • By Chatrak Editorial': { ru: '18 апреля 2026 • Редакция Chatrak', hy: '2026 թ. ապրիլի 18 • Chatrak-ի խմբագրություն' },
        'April 15, 2026': { ru: '15 апреля 2026', hy: '2026 թ. ապրիլի 15' },
        'April 10, 2026': { ru: '10 апреля 2026', hy: '2026 թ. ապրիլի 10' },
        'April 05, 2026': { ru: '5 апреля 2026', hy: '2026 թ. ապրիլի 5' },
        'April 01, 2026': { ru: '1 апреля 2026', hy: '2026 թ. ապրիլի 1' },
        'The 2026 World Chess Championship: A New Era Begins': { ru: 'Чемпионат мира по шахматам 2026: начинается новая эра', hy: 'Շախմատի աշխարհի առաջնություն 2026․ սկսվում է նոր դարաշրջան' },
        "The tension is palpable as the world's finest minds clash in the ultimate test of strategy. With traditional openings being heavily scrutinized, players are resorting to psychological warfare and obscure middle-game structures to break the symmetry...": { ru: 'Напряжение ощутимо: сильнейшие умы мира сходятся в главном испытании стратегии. Когда традиционные дебюты тщательно изучены, игроки прибегают к психологической борьбе и редким структурам миттельшпиля...', hy: 'Լարվածությունը զգալի է․ աշխարհի լավագույն մտքերը բախվում են ռազմավարության գլխավոր փորձության մեջ։ Երբ ավանդական սկզբնախաղերը մանրակրկիտ ուսումնասիրված են, խաղացողները դիմում են հոգեբանական պայքարի և միջնախաղի հազվագյուտ կառուցվածքների...' },
        "The tension is palpable as the world's finest minds clash in the ultimate test of strategy. With traditional openings being heavily scrutinized, players are resorting to psychological warfare and obscure middle-game structures to break the symmetry. <br><br> Experts predict that this championship will fundamentally change how chess is played at the elite level for the next decade.": { ru: 'Напряжение ощутимо: сильнейшие умы мира сходятся в главном испытании стратегии. Когда традиционные дебюты тщательно изучены, игроки прибегают к психологической борьбе и редким структурам миттельшпиля, чтобы нарушить симметрию.<br><br>Эксперты прогнозируют, что этот чемпионат радикально изменит шахматы элитного уровня на следующее десятилетие.', hy: 'Լարվածությունը զգալի է․ աշխարհի լավագույն մտքերը բախվում են ռազմավարության գլխավոր փորձության մեջ։ Երբ ավանդական սկզբնախաղերը մանրակրկիտ ուսումնասիրված են, խաղացողները դիմում են հոգեբանական պայքարի և միջնախաղի հազվագյուտ կառուցվածքների՝ համաչափությունը խախտելու համար։<br><br>Փորձագետները կանխատեսում են, որ այս առաջնությունը էապես կփոխի էլիտար շախմատը առաջիկա տասնամյակում։' },
        'Read Full Story': { ru: 'Читать полностью', hy: 'Կարդալ ամբողջությամբ' },
        'Carlsen Dominates Rapid Circuit': { ru: 'Карлсен доминирует в рапиде', hy: 'Կարլսենը գերիշխում է ռապիդում' },
        'Magnus continues to prove that instinct and speed are just as crucial as deep calculation in the modern era of chess.': { ru: 'Магнус продолжает доказывать, что в современных шахматах инстинкт и скорость так же важны, как глубокий расчёт.', hy: 'Մագնուսը շարունակում է ապացուցել, որ ժամանակակից շախմատում բնազդն ու արագությունը նույնքան կարևոր են, որքան խորը հաշվարկը։' },
        "Magnus continues to prove that instinct and speed are just as crucial as deep calculation in the modern era of chess. His recent performance in the rapid circuit showed unparalleled positional understanding. <br><br> 'I just play what feels right,' Carlsen commented after his stunning 9/10 streak.": { ru: 'Магнус продолжает доказывать, что в современных шахматах инстинкт и скорость так же важны, как глубокий расчёт. Его последнее выступление в рапиде показало исключительное позиционное понимание.<br><br>«Я просто играю то, что чувствуется правильным», — сказал Карлсен после впечатляющего результата 9/10.', hy: 'Մագնուսը շարունակում է ապացուցել, որ ժամանակակից շախմատում բնազդն ու արագությունը նույնքան կարևոր են, որքան խորը հաշվարկը։ Նրա վերջին ելույթը ռապիդում ցույց տվեց բացառիկ դիրքային ըմբռնում։<br><br>«Ես պարզապես խաղում եմ այն, ինչ ճիշտ է թվում», — ասաց Կարլսենը իր տպավորիչ 9/10 արդյունքից հետո։' },
        'Read More': { ru: 'Подробнее', hy: 'Կարդալ ավելին' },
        'Neural Networks Redefining Theory': { ru: 'Нейросети переосмысливают теорию', hy: 'Նեյրոցանցերը վերաիմաստավորում են տեսությունը' },
        'How deep learning algorithms and custom engines are creating completely new paradigms in opening preparation.': { ru: 'Как алгоритмы глубокого обучения и кастомные движки создают новые парадигмы дебютной подготовки.', hy: 'Ինչպես խորը ուսուցման ալգորիթմներն ու հատուկ շարժիչները ստեղծում են սկզբնախաղային պատրաստության նոր պարադիգմներ։' },
        'How deep learning algorithms and custom engines are creating completely new paradigms in opening preparation. Traditional engine evaluations are being challenged by neural networks that prioritize long-term compensation over immediate material gain.': { ru: 'Алгоритмы глубокого обучения и кастомные движки создают новые парадигмы дебютной подготовки. Традиционные оценки движков оспариваются нейросетями, которые ставят долгосрочную компенсацию выше мгновального материального преимущества.', hy: 'Խորը ուսուցման ալգորիթմներն ու հատուկ շարժիչները ստեղծում են սկզբնախաղային պատրաստության նոր պարադիգմներ։ Ավանդական շարժիչների գնահատականները վիճարկվում են նեյրոցանցերի կողմից, որոնք անմիջական նյութական շահից ավելի կարևորում են երկարաժամկետ փոխհատուցումը։' },
        'The Psychology of the Attack: Mikhail Tal': { ru: 'Психология атаки: Михаил Таль', hy: 'Գրոհի հոգեբանությունը․ Միխայիլ Տալ' },
        'Analyzing the social and psychological pressure applied by the "Magician from Riga" during his most complex sacrifices.': { ru: 'Разбор социального и психологического давления, которое «Волшебник из Риги» создавал во время сложнейших жертв.', hy: 'Վերլուծություն այն սոցիալական և հոգեբանական ճնշման, որը «Ռիգայի կախարդը» ստեղծում էր իր ամենաբարդ զոհաբերությունների ժամանակ։' },
        "Analyzing the social and psychological pressure applied by the 'Magician from Riga' during his most complex sacrifices. Tal didn't just play the board; he played the opponent. His speculative sacrifices often had flaws, but defending them under time pressure was nearly impossible for humans.": { ru: 'Разбор социального и психологического давления, которое «Волшебник из Риги» создавал во время сложнейших жертв. Таль играл не только на доске — он играл против человека. Его рискованные жертвы часто имели изъяны, но защищаться от них в цейтноте было почти невозможно.', hy: 'Վերլուծություն այն սոցիալական և հոգեբանական ճնշման, որը «Ռիգայի կախարդը» ստեղծում էր իր ամենաբարդ զոհաբերությունների ժամանակ։ Տալը խաղում էր ոչ միայն տախտակի վրա, այլև մրցակցի դեմ։ Նրա ռիսկային զոհաբերությունները հաճախ թերություններ ունեին, սակայն ժամանակի ճնշման տակ դրանցից պաշտպանվելը գրեթե անհնար էր։' },
        'Yerevan Open Sets New Attendance Record': { ru: 'Yerevan Open установил новый рекорд посещаемости', hy: 'Yerevan Open-ը սահմանեց մասնակցության նոր ռեկորդ' },
        'The capital of chess gathers over 500 participants, bridging the gap between young prodigies and seasoned veterans.': { ru: 'Шахматная столица собрала более 500 участников, объединив юных талантов и опытных ветеранов.', hy: 'Շախմատային մայրաքաղաքը հավաքեց ավելի քան 500 մասնակից՝ միավորելով պատանի տաղանդներին և փորձառու վետերաններին։' },
        'The capital of chess gathers over 500 participants, bridging the gap between young prodigies and seasoned veterans. The atmosphere at the Tigran Petrosian Chess House was electric as players from 30 different countries competed for the grand prize.': { ru: 'Шахматная столица собрала более 500 участников, объединив юных талантов и опытных ветеранов. Атмосфера в Доме шахмат имени Тиграна Петросяна была невероятной: игроки из 30 стран боролись за главный приз.', hy: 'Շախմատային մայրաքաղաքը հավաքեց ավելի քան 500 մասնակից՝ միավորելով պատանի տաղանդներին և փորձառու վետերաններին։ Տիգրան Պետրոսյանի անվան շախմատի տանը մթնոլորտը լարված ու ոգևորիչ էր, երբ 30 երկրների խաղացողները պայքարում էին գլխավոր մրցանակի համար։' },
        'Full article text will be available soon.': { ru: 'Полный текст статьи скоро будет доступен.', hy: 'Հոդվածի ամբողջական տեքստը շուտով հասանելի կլինի։' },
        'World Championship': { ru: 'Чемпионат мира', hy: 'Աշխարհի առաջնություն' },
        'Magnus Carlsen': { ru: 'Магнус Карлсен', hy: 'Մագնուս Կարլսեն' },
        'AI in Chess': { ru: 'ИИ в шахматах', hy: 'ԱԲ-ն շախմատում' },
        'Mikhail Tal': { ru: 'Михаил Таль', hy: 'Միխայիլ Տալ' },
        'Local Tournament': { ru: 'Местный турнир', hy: 'Տեղական մրցաշար' },
        'Article Image': { ru: 'Изображение статьи', hy: 'Հոդվածի պատկեր' },

        // Product descriptions shown on home cards
        'Polystone Hand-Painted Theme Pieces': { ru: 'Тематические фигуры из полистоуна с ручной росписью', hy: 'Ձեռքով ներկված թեմատիկ պոլիստոուն ֆիգուրներ' },
        'American Revolutionary War Hand Painted Theme Chess Set': { ru: 'Тематический шахматный набор «Война за независимость США» с ручной росписью', hy: 'ԱՄՆ անկախության պատերազմի թեմատիկ շախմատային հավաքածու՝ ձեռքով ներկված' },
        'The Millennium ChessGenius Pro Wood Edition': { ru: 'Millennium ChessGenius Pro Wood Edition', hy: 'Millennium ChessGenius Pro Wood Edition' },
        'Templar Knights Hand Painted Theme Chess Set': { ru: 'Тематический набор «Рыцари-тамплиеры» с ручной росписью', hy: '«Տամպլիեր ասպետներ» թեմատիկ շախմատային հավաքածու՝ ձեռքով ներկված' },
        'Carry-All Plastic Set': { ru: 'Пластиковый набор Carry-All', hy: 'Carry-All պլաստիկ հավաքածու' },
        'Standard Club Carry-All Plastic Chess Set Black & Camel Pieces with Vinyl Rollup Board - Green': { ru: 'Стандартный клубный пластиковый набор Carry-All: чёрные и camel фигуры с зелёной сворачиваемой виниловой доской', hy: 'Ստանդարտ ակումբային Carry-All պլաստիկ հավաքածու՝ սև և camel ֆիգուրներով ու կանաչ փաթաթվող վինիլային տախտակով' },
        'Metal Set With a Case': { ru: 'Металлический набор с кейсом', hy: 'Մետաղական հավաքածու պատյանով' },
        'Pirates & Royal Navy Hand Painted Theme Chess Set': { ru: 'Тематический набор «Пираты и Королевский флот» с ручной росписью', hy: '«Ծովահեններ և թագավորական նավատորմ» թեմատիկ հավաքածու՝ ձեռքով ներկված' },
        'Polystone Set With a board': { ru: 'Набор из полистоуна с доской', hy: 'Պոլիստոուն հավաքածու տախտակով' },
        'Robin Hood Theme Chess Set': { ru: 'Тематический шахматный набор «Робин Гуд»', hy: '«Ռոբին Հուդ» թեմատիկ շախմատային հավաքածու' }
    };

    const PRODUCT_WORDS = {
        ru: [
            ['Hand-Painted', 'с ручной росписью'], ['Hand Painted', 'с ручной росписью'], ['Chess Pieces', 'шахматные фигуры'], ['Chess Piece', 'шахматная фигура'], ['Chess Board', 'шахматная доска'], ['Chess Computer', 'шахматный компьютер'], ['Chess Clock', 'шахматные часы'], ['Chess Sleeve Bag', 'сумка-чехол для шахмат'], ['Chess Scorebook', 'шахматный блокнот'], ['Award Ribbon', 'наградная лента'], ['Travel Set', 'дорожный набор'], ['Tournament Bag', 'турнирная сумка'], ['Carry-All', 'универсальный'], ['Roll-up Board', 'сворачиваемая доска'], ['Mousepad Board', 'доска-коврик'], ['Digital Clock', 'цифровые часы'], ['Power Supply', 'блок питания'], ['Rules Companion', 'справочник правил'], ['Demo Board', 'демонстрационная доска'], ['Wood Board Bag', 'сумка для деревянной доски'], ['Wood Set Bag', 'сумка для деревянного набора'], ['Board Bag', 'сумка для доски'], ['Piece Bag', 'мешок для фигур'], ['Set Bag', 'сумка для набора'], ['Wood Chess Box', 'деревянная шахматная коробка'], ['Chess Box', 'шахматная коробка'], ['Chess Case', 'шахматный кейс'], ['Chess Set', 'шахматный набор'], ['Metal Set', 'металлический набор'], ['Metal Pieces', 'металлические фигуры'], ['Plastic Set', 'пластиковый набор'], ['Plastic Pieces', 'пластиковые фигуры'], ['Wood Pieces', 'деревянные фигуры'], ['Wood Set', 'деревянный набор'], ['Board Set', 'набор с доской'], ['Boxwood', 'самшит'], ['Rosewood', 'палисандр'], ['Golden Rosewood', 'золотистый палисандр'], ['Ebony', 'эбеновое дерево'], ['Ebonized', 'эбонизированный'], ['Walnut', 'орех'], ['Mahogany', 'махагони'], ['Padauk', 'падук'], ['Macassar', 'макассар'], ['Elm Burl', 'кап вяза'], ['Bird\'s Eye Maple', 'клён «птичий глаз»'], ['Maple', 'клён'], ['Alabaster', 'алебастр'], ['Leatherette', 'кожзаменитель'], ['Vinyl', 'винил'], ['Silicone', 'силикон'], ['Floppy', 'мягкая'], ['Magnetic', 'магнитный'], ['Folding', 'складной'], ['Notated', 'с нотацией'], ['Tournament', 'турнирный'], ['Premium', 'премиум'], ['Professional', 'профессиональный'], ['Series', 'серия'], ['Exclusive', 'эксклюзивный'], ['Combo', 'комбо'], ['Alternate', 'альтернативный'], ['Alt', 'альт.'], ['Advanced', 'продвинутый'], ['Element', 'элемент'], ['Performance', 'производительный'], ['Competition', 'соревновательный'], ['School', 'школа'], ['Setup', 'комплект'], ['Standard', 'стандартный'], ['Basic', 'базовый'], ['Classic', 'классический'], ['Deluxe', 'делюкс'], ['Luxury', 'люксовый'], ['Large', 'большой'], ['Small', 'малый'], ['Modern', 'современный'], ['Vintage', 'винтажный'], ['Thematic', 'тематический'], ['Theme', 'тематический'], ['Painted', 'расписной'], ['Polystone', 'полистоун'], ['Metal', 'металл'], ['Plastic', 'пластик'], ['Wood', 'дерево'], ['Set', 'набор'], ['Sets', 'наборы'], ['Pieces', 'фигуры'], ['Piece', 'фигура'], ['Board', 'доска'], ['Boards', 'доски'], ['Bag', 'сумка'], ['Bags', 'сумки'], ['Box', 'коробка'], ['Case', 'кейс'], ['Clock', 'часы'], ['Computer', 'компьютер'], ['Storage', 'хранение'], ['Supplies', 'аксессуары'], ['Black', 'чёрный'], ['Brown', 'коричневый'], ['Blue', 'синий'], ['Green', 'зелёный'], ['Red', 'красный'], ['White', 'белый'], ['Gold', 'золотой'], ['Silver', 'серебряный'], ['Ivory', 'слоновая кость'], ['Camel', 'camel'], ['Tan', 'бежевый'], ['Navy', 'тёмно-синий'], ['Neon Green', 'неоново-зелёный'], ['Royal Blue', 'королевский синий']
        ],
        hy: [
            ['Hand-Painted', 'ձեռքով ներկված'], ['Hand Painted', 'ձեռքով ներկված'], ['Chess Pieces', 'շախմատի ֆիգուրներ'], ['Chess Piece', 'շախմատի ֆիգուր'], ['Chess Board', 'շախմատի տախտակ'], ['Chess Computer', 'շախմատային համակարգիչ'], ['Chess Clock', 'շախմատային ժամացույց'], ['Chess Sleeve Bag', 'շախմատի պահոց-պայուսակ'], ['Chess Scorebook', 'շախմատային գրանցամատյան'], ['Award Ribbon', 'մրցանակային ժապավեն'], ['Travel Set', 'ճանապարհորդական հավաքածու'], ['Tournament Bag', 'մրցաշարային պայուսակ'], ['Carry-All', 'համընդհանուր'], ['Roll-up Board', 'փաթաթվող տախտակ'], ['Mousepad Board', 'փափուկ տախտակ-գորգ'], ['Digital Clock', 'թվային ժամացույց'], ['Power Supply', 'սնուցման բլոկ'], ['Rules Companion', 'կանոնների ուղեցույց'], ['Demo Board', 'ցուցադրական տախտակ'], ['Wood Board Bag', 'փայտե տախտակի պայուսակ'], ['Wood Set Bag', 'փայտե հավաքածուի պայուսակ'], ['Board Bag', 'տախտակի պայուսակ'], ['Piece Bag', 'ֆիգուրների պարկ'], ['Set Bag', 'հավաքածուի պայուսակ'], ['Wood Chess Box', 'փայտե շախմատային տուփ'], ['Chess Box', 'շախմատային տուփ'], ['Chess Case', 'շախմատային պատյան'], ['Chess Set', 'շախմատային հավաքածու'], ['Metal Set', 'մետաղական հավաքածու'], ['Metal Pieces', 'մետաղական ֆիգուրներ'], ['Plastic Set', 'պլաստիկ հավաքածու'], ['Plastic Pieces', 'պլաստիկ ֆիգուրներ'], ['Wood Pieces', 'փայտե ֆիգուրներ'], ['Wood Set', 'փայտե հավաքածու'], ['Board Set', 'տախտակով հավաքածու'], ['Boxwood', 'շիմշատ'], ['Rosewood', 'պալիսանդր'], ['Golden Rosewood', 'ոսկեգույն պալիսանդր'], ['Ebony', 'էբենոս'], ['Ebonized', 'էբենոսապատ'], ['Walnut', 'ընկույզ'], ['Mahogany', 'մահոգանի'], ['Padauk', 'պադուկ'], ['Macassar', 'մակասար'], ['Elm Burl', 'վյազի կապ'], ['Bird\'s Eye Maple', '«թռչնի աչք» թխկի'], ['Maple', 'թխկի'], ['Alabaster', 'ալեբաստր'], ['Leatherette', 'արհեստական կաշի'], ['Vinyl', 'վինիլ'], ['Silicone', 'սիլիկոն'], ['Floppy', 'փափուկ'], ['Magnetic', 'մագնիսական'], ['Folding', 'ծալովի'], ['Notated', 'նշագրումով'], ['Tournament', 'մրցաշարային'], ['Premium', 'պրեմիում'], ['Professional', 'պրոֆեսիոնալ'], ['Series', 'շարք'], ['Exclusive', 'բացառիկ'], ['Combo', 'կոմբո'], ['Alternate', 'այլընտրանքային'], ['Alt', 'այլընտրանք'], ['Advanced', 'առաջադեմ'], ['Element', 'էլեմենտ'], ['Performance', 'արտադրողական'], ['Competition', 'մրցութային'], ['School', 'դպրոց'], ['Setup', 'կոմպլեկտ'], ['Standard', 'ստանդարտ'], ['Basic', 'հիմնական'], ['Classic', 'դասական'], ['Deluxe', 'դելյուքս'], ['Luxury', 'լյուքս'], ['Large', 'մեծ'], ['Small', 'փոքր'], ['Modern', 'ժամանակակից'], ['Vintage', 'վինտաժային'], ['Thematic', 'թեմատիկ'], ['Theme', 'թեմատիկ'], ['Painted', 'ներկված'], ['Polystone', 'պոլիստոուն'], ['Metal', 'մետաղական'], ['Plastic', 'պլաստիկ'], ['Wood', 'փայտե'], ['Set', 'հավաքածու'], ['Sets', 'հավաքածուներ'], ['Pieces', 'ֆիգուրներ'], ['Piece', 'ֆիգուր'], ['Board', 'տախտակ'], ['Boards', 'տախտակներ'], ['Bag', 'պայուսակ'], ['Bags', 'պայուսակներ'], ['Box', 'տուփ'], ['Case', 'պատյան'], ['Clock', 'ժամացույց'], ['Computer', 'համակարգիչ'], ['Storage', 'պահպանում'], ['Supplies', 'պարագաներ'], ['Black', 'սև'], ['Brown', 'շագանակագույն'], ['Blue', 'կապույտ'], ['Green', 'կանաչ'], ['Red', 'կարմիր'], ['White', 'սպիտակ'], ['Gold', 'ոսկեգույն'], ['Silver', 'արծաթագույն'], ['Ivory', 'փղոսկրագույն'], ['Camel', 'camel'], ['Tan', 'բեժ'], ['Navy', 'մուգ կապույտ'], ['Neon Green', 'նեոնային կանաչ'], ['Royal Blue', 'արքայական կապույտ']
        ]
    };

    const PRODUCT_MARKERS = /(Chess|Pieces?|Boards?|Sets?|Clocks?|Computers?|Bags?|Box|Case|Staunton|Walnut|Mahogany|Ebony|Ebonized|Boxwood|Rosewood|Padauk|Vinyl|Silicone|Metal|Plastic|Wood|Tournament|Premium|Classic|Deluxe|Polystone|Italfama|Thematic|Theme|Lardy|Zagreb|Dubrovnik|Knight|Queen|King|Rook|Pawn|Fischer|Spassky|Carlsen|Tal)/i;
    const russianDescriptionCache = new Map();

    function currentLang() {
        const stored = localStorage.getItem(STORAGE_KEY);
        return LANGS[stored] ? stored : FALLBACK_LANG;
    }

    function normalize(value) {
        return String(value || '').replace(/\s+/g, ' ').trim();
    }

    function get(dictValue, lang) {
        if (!dictValue) return null;
        if (typeof dictValue === 'string') return dictValue;
        return dictValue[lang] || dictValue.en || null;
    }

    function replaceAllSafe(text, from, to) {
        const escaped = from.replace(/[.*+?^$\{\}()|[\]\\]/g, '\\$&');
        return text.replace(new RegExp('(^|[^A-Za-z])(' + escaped + ')(?=$|[^A-Za-z])', 'gi'), function (match, prefix) {
            return prefix + to;
        });
    }

    function translateProductName(source, lang) {
        const base = normalize(source);
        if (!base || lang === 'en') return base;
        let result = base;
        const map = (PRODUCT_WORDS[lang] || []).slice().sort((a, b) => b[0].length - a[0].length);
        map.forEach(([from, to]) => {
            result = replaceAllSafe(result, from, to);
        });
        return result.replace(/\s+\//g, '/').replace(/\/\s+/g, '/').replace(/\s{2,}/g, ' ').trim();
    }

    function translateProductDescription(desc, name, lang) {
        const baseDesc = normalize(desc);
        const baseName = normalize(name);
        if (lang === 'ru') return t(baseDesc, 'ru') || baseDesc;
        if (lang === 'en') {
            if (/^[\u0400-\u04FF]/.test(baseDesc) || /[\u0400-\u04FF]/.test(baseDesc)) {
                return `Premium chess item: ${baseName || 'selected product'}. Carefully selected for training, tournaments, clubs and home collections.`;
            }
            return t(baseDesc, 'en') || baseDesc;
        }
        const hyName = translateProductName(baseName, 'hy') || 'ընտրված ապրանք';
        return `Պրեմիում շախմատային ապրանք՝ ${hyName}։ Ընտրված է մարզումների, մրցաշարերի, ակումբների և տան հավաքածուների համար։`;
    }

    function t(source, forcedLang) {
        const lang = forcedLang || currentLang();
        const key = normalize(source);
        if (!key) return source;
        const direct = get(DICT[key], lang);
        if (direct) return direct;

        if (lang !== 'en' && PRODUCT_MARKERS.test(key)) {
            return translateProductName(key, lang);
        }
        return key;
    }

    function translateMixedStatus(text, lang) {
        const key = normalize(text);
        if (DICT[key]) return t(key, lang);
        if (/^(.+) is in check$/.test(key)) {
            const color = key.replace(/ is in check$/, '');
            if (lang === 'ru') return `${t(color, lang)} под шахом`;
            if (lang === 'hy') return `${t(color, lang)} շախի տակ է`;
        }
        return t(key, lang);
    }

    const textBases = new WeakMap();
    let applying = false;

    function translateTextNode(node, lang) {
        const original = node.nodeValue;
        if (!original || !normalize(original)) return;
        const leading = original.match(/^\s*/)[0];
        const trailing = original.match(/\s*$/)[0];
        if (!textBases.has(node)) textBases.set(node, normalize(original));
        const base = textBases.get(node);
        const translated = translateMixedStatus(base, lang);
        if (translated && normalize(original) !== translated) {
            node.nodeValue = leading + translated + trailing;
        }
    }

    function translateAttributes(el, lang) {
        ['placeholder', 'title', 'alt', 'aria-label'].forEach(attr => {
            if (!el.hasAttribute || !el.hasAttribute(attr)) return;
            const storeAttr = 'data-i18n-' + attr + '-source';
            if (!el.hasAttribute(storeAttr)) el.setAttribute(storeAttr, normalize(el.getAttribute(attr)));
            const base = el.getAttribute(storeAttr);
            el.setAttribute(attr, t(base, lang));
        });

        if (el.classList && el.classList.contains('store-box')) {
            if (el.hasAttribute('data-name') && !el.hasAttribute('data-name-source')) {
                el.setAttribute('data-name-source', normalize(el.getAttribute('data-name')));
            }
            if (el.hasAttribute('data-desc') && !el.hasAttribute('data-desc-source')) {
                el.setAttribute('data-desc-source', normalize(el.getAttribute('data-desc')));
            }
            const baseName = el.getAttribute('data-name-source') || el.getAttribute('data-name') || '';
            const baseDesc = el.getAttribute('data-desc-source') || el.getAttribute('data-desc') || '';
            if (baseName) el.setAttribute('data-name', translateProductName(baseName, lang));
            if (baseDesc) el.setAttribute('data-desc', translateProductDescription(baseDesc, baseName, lang));
        }
    }

    function applyI18n() {
        if (applying) return;
        applying = true;
        const lang = currentLang();
        document.documentElement.setAttribute('lang', lang);
        document.documentElement.setAttribute('data-lang', lang);

        if (!document.documentElement.dataset.i18nTitleSource) {
            document.documentElement.dataset.i18nTitleSource = document.title;
        }
        document.title = t(document.documentElement.dataset.i18nTitleSource, lang);

        document.querySelectorAll('input, textarea, img, [title], [aria-label], .store-box').forEach(el => translateAttributes(el, lang));

        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
            acceptNode(node) {
                const parent = node.parentElement;
                if (!parent) return NodeFilter.FILTER_REJECT;
                if (['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(parent.tagName)) return NodeFilter.FILTER_REJECT;
                if (parent.closest && parent.closest('.language-switcher')) return NodeFilter.FILTER_REJECT;
                return normalize(node.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
            }
        });
        const nodes = [];
        while (walker.nextNode()) nodes.push(walker.currentNode);
        nodes.forEach(node => translateTextNode(node, lang));

        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
            btn.setAttribute('aria-pressed', String(btn.dataset.lang === lang));
        });

        applying = false;
    }

    function isHomePage() {
        const path = (window.location.pathname || '').replace(/\\/g, '/');
        const fileName = path.substring(path.lastIndexOf('/') + 1).toLowerCase();
        return fileName === '' || fileName === 'index.html';
    }

    function insertLanguageSwitcher() {
        if (!isHomePage()) return;

        const header = document.querySelector('.header');
        if (!header || header.querySelector('.language-switcher')) return;
        const switcher = document.createElement('div');
        switcher.className = 'language-switcher';
        switcher.setAttribute('aria-label', 'Language selector');
        switcher.innerHTML = Object.keys(LANGS).map(code => `<button type="button" class="lang-btn" data-lang="${code}" aria-label="${LANGS[code].name}">${LANGS[code].label}</button>`).join('');

        const login = header.querySelector('#login-btn');
        if (login && login.parentElement && login.parentElement.classList.contains('icons')) {
            login.parentElement.insertBefore(switcher, login);
        } else if (login) {
            header.insertBefore(switcher, login);
        } else {
            header.appendChild(switcher);
        }

        switcher.addEventListener('click', e => {
            const btn = e.target.closest('.lang-btn');
            if (!btn) return;
            setLanguage(btn.dataset.lang);
        });
    }

    function setLanguage(lang) {
        if (!LANGS[lang]) lang = FALLBACK_LANG;
        localStorage.setItem(STORAGE_KEY, lang);
        applyI18n();
        document.dispatchEvent(new CustomEvent('chatrak:languagechange', { detail: { lang } }));
    }

    function getCardItem(card) {
        const baseName = card.getAttribute('data-name-source') || card.getAttribute('data-name') || 'Unknown Item';
        const baseDesc = card.getAttribute('data-desc-source') || card.getAttribute('data-desc') || '';
        const priceAttr = card.getAttribute('data-price');
        const imgEl = card.querySelector('img');
        return {
            name: translateProductName(baseName, currentLang()),
            sourceName: baseName,
            desc: translateProductDescription(baseDesc, baseName, currentLang()),
            sourceDesc: baseDesc,
            price: priceAttr ? parseFloat(priceAttr) : 0,
            img: imgEl ? imgEl.src : ''
        };
    }

    window.chatrakT = function (text) { return t(text); };
    window.ChatrakI18n = {
        t,
        apply: applyI18n,
        setLanguage,
        currentLang,
        productName: translateProductName,
        productDescription: translateProductDescription,
        getCardItem
    };

    document.addEventListener('DOMContentLoaded', () => {
        insertLanguageSwitcher();
        applyI18n();

        const observer = new MutationObserver(() => {
            if (applying) return;
            clearTimeout(observer._timer);
            observer._timer = setTimeout(applyI18n, 30);
        });
        observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    });
})();
