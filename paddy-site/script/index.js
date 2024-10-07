let allPets = [];
let likedPets = [];
let filteredPets = [];
let isSortedAscending = true;

const showSpinner = () => {
    const spinner = document.getElementById('loading-spinner');
    spinner.classList.remove('hidden');
}

const hideSpinner = () => {
    const spinner = document.getElementById('loading-spinner');
    spinner.classList.add('hidden');
}

const fetchApiGlobal = async (endpoint) => {
    try {
        const response = await fetch(`https://openapi.programming-hero.com/api/peddy/${endpoint}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching data from API:", error);
    }
}

const categoryItem = async () => {
    const data = await fetchApiGlobal('categories');
    displayCategory(data.categories);
}

const displayCategory = (categories) => {
    const categoryButtonContainer = document.getElementById('category-buttons');
    categoryButtonContainer.innerHTML = '';

    categories.forEach((category) => {
        const div = document.createElement('div');
        div.innerHTML = `
            <button class="category-btn btn border-gray-300 p-2 text-xl hover:bg-gray-200" data-category="${category.category}">
                <img class="w-8" src="${category.category_icon}" alt="">
                ${category.category}
            </button>
        `;
        categoryButtonContainer.append(div);
    });

    const categoryButtons = document.querySelectorAll('.category-btn');

    categoryButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            categoryButtons.forEach(btn => {
                btn.classList.remove('bg-[#0E7A81]', 'text-white');
                btn.classList.add('border-gray-300', 'text-xl');
            });

            event.currentTarget.classList.add('bg-[#0E7A81]', 'text-white');
            event.currentTarget.classList.remove('border-gray-300');

            const selectedCategory = event.currentTarget.getAttribute('data-category');
            filterPetsByCategory(selectedCategory);
        });
    });
}


// Fetch and display all pets
const postPates = async () => {
    showSpinner();
    setTimeout(async () => {
        const data = await fetchApiGlobal('pets');
        allPets = data.pets;
        filteredPets = [...allPets];
        displayPates(filteredPets);
        hideSpinner();
    }, 2000)
}

const displayPates = (pets) => {
    const petsDisplay = document.getElementById('display-pats');
    petsDisplay.innerHTML = '';

    if (pets.length === 0) {
        const noDataDiv = document.createElement('div');
        noDataDiv.innerHTML = `
            <div class=" text-xl font-semibold text-gray-500">
                 <div class="flex justify-center items-center">
                    <img class="" src="./images/error.webp" alt="">
                </div>
                <h2 class="text-center text-2xl font-bold">No information Available</h2>
                <p class="mt-5 text-center text-gray-400">There is nothing data at this moments please click the another category button.</p>
            </div>
        `;
        petsDisplay.append(noDataDiv);
    } else {
        pets.forEach((pet) => {
            // console.log(pet);
            const div = document.createElement('div');
            div.innerHTML = `
                <div class="border border-gray-300 p-2 rounded">
                    <img class="w-[400px] mx-auto" src=${pet.image} alt="thumb">
                    <div class="ml-3 mt-5">
                        <h2><i class="fa-solid fa-bread-slice"></i> Breed: ${pet.breed?pet.breed:"item is not aviable"}</h2>
                        <h2><i class="fa-regular fa-calendar-days"></i> Date Of Birth: ${pet.date_of_birth}</h2>
                        <h2><i class="fa-solid fa-mercury"></i> Gender: ${pet.gender?pet.gender:"gender not found"}</h2>
                        <h2><i class="fa-solid fa-dollar-sign"></i> Price: ${pet.price?pet.price:"undefind"}$</h2>
                    </div>
                    <div class="w-11/12 mt-2 border-b mx-auto"></div>
                    <div class="w-11/12 mx-auto mt-2 flex justify-between items-center">
                        <button class="p-2 border border-gray-300 rounded like-btn" data-id="${pet.petId}">
                            <i class="fa-solid fa-thumbs-up"></i>
                        </button>
                        <button class="p-2 font-semibold border border-gray-300 adopt-btn rounded text-[#0E7A81]" data-id="${pet.petId}">
                            Adopt
                        </button>
                        <button class="p-2 font-semibold border border-gray-300 details-btn rounded text-[#0E7A81]" data-id="${pet.petId}">
                            Details
                        </button>
                    </div>
                </div>
            `;
            petsDisplay.append(div);

            div.querySelector('.like-btn').addEventListener('click', (event) => {
                const pet_Id = event.target.closest('button').getAttribute('data-id');
                addPetToLiked(pet_Id);
            });

            div.querySelector('.adopt-btn').addEventListener('click', (event) => {
                adoptPet(event);
            });

            div.querySelector('.details-btn').addEventListener('click', (event) => {
                const pet_Id = event.target.closest('button').getAttribute('data-id');
                getPetDetails(pet_Id);
            });
        });
    }
}

// Add pet to liked pets
const addPetToLiked = (pet_Id) => {
    const nPetId = Number(pet_Id);
    const likedPet = allPets.find(pet => pet.petId === nPetId);
    if (!likedPets.some(pet => pet.petId === nPetId)) {
        likedPets.push(likedPet);
    }

    displayLikedPets();
}

const displayLikedPets = () => {
    const likedDisplay = document.getElementById('likedData');
    likedDisplay.innerHTML = '';

    if (likedPets.length === 0) {
        likedDisplay.innerHTML = `
            <div class="text-center text-xl font-semibold text-gray-500">
                No Liked Pets Yet
            </div>
        `;
    } else {
        likedPets.forEach(pet => {
            const div = document.createElement('div');
            div.innerHTML = `
                <div class="p-2 rounded">
                    <img class="w-[200px] mx-auto" src=${pet.image} alt="">
                </div>
            `;
            likedDisplay.append(div);
        });
    }
}

// Fetch single pet details dynamically
const getPetDetails = async (petId) => {
    const nPetId = Number(petId);
    const pet = await fetchApiGlobal(`pet/${nPetId}`);
    displaySinglePet(pet.petData);
}

// Display single pet details in a modal or separate section
const displaySinglePet = (pet) => {
    if (pet) {
        document.getElementById('modalTitle').innerText = pet.pet_name;
        document.getElementById('modalImage').src = pet.image;
        document.getElementById('modalDetails').innerText = pet.pet_details;
        document.getElementById('modalPrice').innerText = `Price: $${pet.price}`;

        document.getElementById('petDetailsModal').checked = true;
    }
}

const adoptPet = (event) => {
    document.getElementById('adoptModal').checked = true;

    const pet_btn = event.target.closest('button');

    let countdown = 3;
    const countdownDisplay = document.getElementById('adoptCountdown');
    countdownDisplay.innerText = countdown;

    pet_btn.disabled = true;

    const intervalId = setInterval(() => {
        countdown--;
        countdownDisplay.innerText = countdown;

        if (countdown <= 0) {
            clearInterval(intervalId);
            document.getElementById('adoptModal').checked = false;
        }
    }, 1000);

    pet_btn.classList.add('btn');
    pet_btn.classList.add('btn-disabled');
};

// Sort pets by price
const sortByPrice = () => {
    filteredPets.sort((a, b) => {
        if (isSortedAscending) {
            return a.price - b.price;
        } else {
            return b.price - a.price;
        }
    });
    isSortedAscending = !isSortedAscending;

    displayPates(filteredPets);

}

document.getElementById('shortBy').addEventListener('click', sortByPrice);

// Filter pets by category
const filterPetsByCategory = (category) => {
    showSpinner();
    setTimeout(() => {
        if (category === 'All') {
            filteredPets = [...allPets];
        } else {
            filteredPets = allPets.filter(pet => pet.category === category);
        }
        displayPates(filteredPets);
        hideSpinner();
    }, 2000)

}

categoryItem();
postPates(); 