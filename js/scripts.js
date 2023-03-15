let form = document.forms[0];
let input = form.elements.request;
let request;
form.onsubmit = function (event) {
  event.preventDefault();
  request = input.value;

  fetch(
    `https://api.github.com/search/repositories?q=${request}&sort=stars&order=desc&per_page=10`
  )
    .then((response) => response.json())
    .then((data) => getListRepositories(data.items))
    .catch((error) => {
      console.log(`Не удалость выполнить запрос`);
    });
};

function getListRepositories(array) {
  let div = document.querySelector(".responses");

  div.innerHTML = "";

  array.forEach((element) => {
    let rep = {
      name: element.name,
      url: element.html_url,
      language: element.language,
      owner: element.owner.login,
      pushed_at: new Date(element.pushed_at),
      description: element.description,
    };
    let response = createResponsNode(rep);
    div.append(response);

    if (array.length == 0) {
      div.innerHTML = "Ничего не найдено";
    }
  });
}

function createResponsNode(rep) {
  const options = {
    hour: "numeric",
    minute: "numeric",
  };
  let date = rep.pushed_at.toLocaleDateString("ru-RU", options).split(", ");
  let time = date[1];
  let day = date[0];
  let div = document.createElement("div");
  div.className = "responses__item";
  div.innerHTML = `<a target="_blank" class="responses__link" href="${rep.url}"><span class="responses__name">${rep.name}</span></a>
     <span class="responses__description">Описание: ${rep.description}</span>
     <span class="responses__owner">Создатель: ${rep.owner}</span>
     <span class="responses__language">Язык: ${rep.language}</span>
     <span class="responses__pushed">Обновлено: ${day}, в ${time}</span>`;
  return div;
}
