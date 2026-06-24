window.Pages = window.Pages || {};

window.Pages.index = function () {
    return `
       <section class="bg-heritage min-h-screen text-white flex flex-col">
        <img class="lang lang-vi" width="100%" src="./bgVietnamese.png" alt="test" style="height: 100vh;">
        <img class="lang lang-eng hidden" width="100%" src="./bgEnglish.png" alt="test" style="height: 100vh;">
        <a href="#/page1"><button class="absolute top-[60vh] left-[2vw] w-[60%] rounded-lg py-[4vh]"></button></a>
        <a href="#/page2"><button class="absolute top-[70vh] left-[2vw] w-[60%] rounded-lg py-[2.7vh]"></button></a>
        <a href="#/page3"><button class="absolute top-[78vh] left-[2vw] w-[60%] rounded-lg py-[3.3vh]"></button></a>
        <button onclick="changeLang()" class="absolute bottom-[2vw] right-[2vw] w-[20%] rounded-lg py-[4vh]"></button>
    </section>
    `;
};