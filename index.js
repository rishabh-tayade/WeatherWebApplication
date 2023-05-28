const userTab= document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const userContainer= document.querySelector(".weather-container");
const grantAccessButton= document.querySelector("[data-grantAccess]");
const grantAccessContainer= document.querySelector(".grant-location-container");
const searchForm=document.querySelector("[data-searchForm]");
const loadingScreen=document.querySelector(".loading-container");
const userInfoContainer= document.querySelector(".user-info-container");
const searchInput= document.querySelector("[data-searchInput]");
const errorImageContainer=document.querySelector(".error-not-found-container");
let currentTab=userTab;
const API_Key="0dcf0dca2db89443fc440c4ba0745de8";
currentTab.classList.add("current-tab");
getfromSessionStorage();
grantAccessButton.addEventListener("click", getLocation);

function switchTab(clickedTab){
    if(clickedTab != currentTab)
    {
        currentTab.classList.remove("current-tab");
        currentTab=clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else
        {
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            getfromSessionStorage();
        }
    }
}

userTab.addEventListener("click", ()=>{
    //pass clicked tab as input parameter
    switchTab(userTab);
});

searchTab.addEventListener("click", ()=>{
    //pass clicked tab as input parameter
    switchTab(searchTab);
});

//checks if coordinates are already present in session storage.
function getfromSessionStorage(){
    const localCoordinates= sessionStorage.getItem("user-coordinates");
    if(!localCoordinates)
        grantAccessContainer.classList.add("active");
    else
        {
            const coordinates=  JSON.parse(localCoordinates);
            fetchUserWeatherInfo(coordinates);
        }
}

async function fetchUserWeatherInfo(coordinates)
{
    const {lat,lon}=coordinates;

    //make grantaccesscontainer invisible
    grantAccessContainer.classList.remove("active");
    //make loader screen visible
    loadingScreen.classList.add("active");

    //api call
    try{
        const response =await fetch(`http://api.weatherstack.com/current?access_key=${API_Key}&query=${lat},${lon}`);
        const data=await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        loadingScreen.classList.remove("active");
        errorImageContainer.classList.add("active");
    }

}

function renderWeatherInfo(weatherInfo){
    //fetch the element
    const cityName= document.querySelector("[data-cityName]");
    const desc= document.querySelector("[data-weatherDesc]");
    const weatherIcon=document.querySelector("[data-weatherIcon]");
    const temp= document.querySelector("[data-temp]");
    const windSpeed=document.querySelector("[data-windSpeed]");
    const humidity=document.querySelector("[data-humidity]");
    const cloudiness=document.querySelector("[data-cloudiness]");

    //fetch objects from weather info obj and put in UI
    cityName.innerText= `${weatherInfo?.location?.name}, ${weatherInfo?.location?.country}`;
    desc.innerText=weatherInfo?.current?.weather_descriptions?.[0];
    weatherIcon.src= weatherInfo?.current?.weather_icons?.[0];
    temp.innerText=`${weatherInfo?.current?.temperature} °C`;
    windSpeed.innerText=`${weatherInfo?.current?.wind_speed} km/hr`;
    humidity.innerText=`${weatherInfo?.current?.humidity} %`;
    cloudiness.innerText=`${weatherInfo?.current?.cloudcover} %`;
}

function showPosition(position){
    const userCoodinates={
        lat: position.coords.latitude,
        lon:position.coords.longitude
    }

    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoodinates));
    fetchUserWeatherInfo(userCoodinates);
}

function getLocation(){
    if(navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        // an alert for no geolocation support available.
        alert("Geolocation support is not available!");
        return;
    }
}

searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();

    let cityName= searchInput.value;

    if(cityName==="")
        return;
    else
        fetchSearchWeatherInfo(cityName);
})

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
        const response =await fetch(`http://api.weatherstack.com/current?access_key=${API_Key}&query=${city}`);
        const data= await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
       
    }
    catch(err){
        loadingScreen.classList.remove("active");
        errorImageContainer.classList.add("active");
    }
}
