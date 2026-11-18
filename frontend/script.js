async function apiFetch(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response.json();
}

async function getData() {
  try {
    const data = await apiFetch('/professional');
    displayAllData(data);
  } catch (error) {
    const heading = document.getElementById('professionalName');
    if (heading) heading.textContent = 'Profile information is temporarily unavailable.';
    console.error('Unable to load professional profile:', error);
  }
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value || '';
}

function displayAllData(data) {
  setText('professionalName', data.professionalName);
  setText('primaryDescription', data.primaryDescription);
  setText('workDescription1', data.workDescription1);
  setText('workDescription2', data.workDescription2);
  setText('linkTitleText', data.linkTitleText);
  setText('contactText', data.contactText);

  const image = document.getElementById('professionalImage');
  if (image && data.base64Image) {
    image.src = `data:image/png;base64,${data.base64Image}`;
    image.alt = data.professionalName ? `Portrait of ${data.professionalName}` : 'Professional profile portrait';
  }

  const nameLink = document.getElementById('nameLink');
  if (nameLink && data.nameLink) {
    nameLink.textContent = data.nameLink.firstName || '';
    nameLink.href = data.nameLink.url || '#';
    nameLink.target = '_blank';
    nameLink.rel = 'noopener noreferrer';
  }

  const linkedInLink = document.getElementById('linkedInLink');
  if (linkedInLink && data.linkedInLink) {
    linkedInLink.textContent = data.linkedInLink.text || '';
    linkedInLink.href = data.linkedInLink.link || '#';
    linkedInLink.target = '_blank';
    linkedInLink.rel = 'noopener noreferrer';
  }

  const githubLink = document.getElementById('githubLink');
  if (githubLink && data.githubLink) {
    githubLink.textContent = data.githubLink.text || '';
    githubLink.href = data.githubLink.link || '#';
    githubLink.target = '_blank';
    githubLink.rel = 'noopener noreferrer';
  }
}

getData();
