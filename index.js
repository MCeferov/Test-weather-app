async function fetchData(){
    const api_key="26c7b37e3a482d196fe369b701e2d5eb"
    const api_key2="141e66237a084e66abf112106242607"
    const city=document.querySelector('input').value
    const hourly_list=document.querySelector('.hourly_forecast_hours')
    const body=document.querySelector('body')
    try{
        const forecast_response=await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${api_key}&units=metric`)
        const forecast_data=await forecast_response.json()
        const today_response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}&units=metric`)
        const today_data=await today_response.json()
        const hourly=await fetch(`http://api.weatherapi.com/v1//forecast.json?days=10&q=${city}&key=${api_key2}&aqi=yes`)
        const hourly_data=await hourly.json()
        console.log(forecast_data);
        console.log(today_data);
        console.log(hourly_data);
        const bgdata=today_data.weather[0].main
        
        if(bgdata=="Clouds"){
            body.style.background="url(./img/Clouds.jpg)"
            body.style.backgroundRepeat="no-repeat"
            body.style.backgroundSize="120%"
            body.style.backgroundAttachment="fixed"
            body.style.background
        }
        else if(bgdata=="Drizzle"){
            body.style.background="url(./img/Drizzle.gif)"
            body.style.backgroundRepeat="no-repeat"
            body.style.backgroundSize="120%"
            body.style.backgroundAttachment="fixed"
        }
        else if(bgdata=="Thunderstorm"){
            body.style.background="url(https://j.gifs.com/Kj4Ow6.gif)"
            body.style.backgroundRepeat="no-repeat"
            body.style.backgroundSize="120%"
            body.style.backgroundAttachment="fixed"
        }
        else if(bgdata=="Rain"){
            body.style.background="url(./img/Rain.gif)"
            body.style.backgroundRepeat="no-repeat"
            body.style.backgroundSize="120%"
            body.style.backgroundAttachment="fixed"
        }
        else if(bgdata=="Snow"){
            body.style.background="url(./img/Snow.gif)"
            body.style.backgroundRepeat="no-repeat"
            body.style.backgroundSize="120%"
            body.style.backgroundAttachment="fixed"
        }
        else if(bgdata=="Mist"){
            body.style.background="url(./img/Mist.gif)"
            body.style.backgroundRepeat="no-repeat"
            body.style.backgroundSize="120%"
            body.style.backgroundAttachment="fixed"
        }
        else{
            if(today_data.weather[0].icon.slice(-1)=="d"){
                body.style.background="url(./img/Clear_day.jpg)"
                body.style.backgroundRepeat="no-repeat"
                body.style.backgroundSize="130%"
                body.style.backgroundAttachment="fixed"
            }
            else{
                body.style.background="url(./img/Clear_night.png)"
                body.style.backgroundRepeat="no-repeat"
                body.style.backgroundSize="130%"
                body.style.backgroundAttachment="fixed"
            }
        }
        hourly_list.innerHTML=""
        const descr=[]
        today_data.weather[0].description.split(' ').forEach((element)=>{
            descr.push(element[0].toUpperCase()+element.slice(1))
        })
        for(let i of hourly_data.forecast.forecastday[0].hour){
                const listItem=document.createElement('li')
                listItem.innerHTML=`
                    <p>${i.time.slice(11)}</p>
                    <img src="${i.condition.icon}" alt="">
                    <span>${Math.round(i.temp_c)}°</span>
                `
                hourly_list.appendChild(listItem)
        }
        document.querySelector('.weather_now').innerHTML=`
            <h2>${city}</h2>
            <h1>${Math.round(today_data.main.temp)}°</h1>
            <p>${descr.join(" ")}</p>
            <span>H:${Math.round(hourly_data.forecast.forecastday[0].day.maxtemp_c)}° L:${Math.round(hourly_data.forecast.forecastday[0].day.mintemp_c)}°</span>
        `
        const week_arr=['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
        document.querySelector('.ten_day_forecast ul').innerHTML=""
        const weekplus=new Date().getDay()
        for(let i in hourly_data.forecast.forecastday){
            const ListItem=document.createElement('li')
            ListItem.innerHTML=`<p>${week_arr[(weekplus+i%7-1)%7]}</p>
                            <img src="${hourly_data.forecast.forecastday[i].day.condition.icon}" alt="">
                            <span>${Math.round(hourly_data.forecast.forecastday[i].day.mintemp_c)}°</span>
                            <div class="gray_bar">
                                <div class="gradient_bar"></div>
                            </div>
                            <p>${Math.round(hourly_data.forecast.forecastday[i].day.maxtemp_c)}°</p>`
            
            if(i==0){
                ListItem.querySelector('p').textContent="Today"
            }
            document.querySelector('.ten_day_forecast ul').appendChild(ListItem)
        }
        var map = L.map('map').setView([today_data.coord.lat+0.0065,today_data.coord.lon-0.0075], 15);
      
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          
        }).addTo(map);
      
        L.marker(today_data.coord).addTo(map)
        const air_quality=document.querySelector('.air_quality')
        const aqi=Math.round(hourly_data.forecast.forecastday[0].day.air_quality.pm2_5*50/12)
        let aqi_result=""
        if(aqi<50){
            aqi_result="Good"
        }
        else if(aqi<100){
            aqi_result="Moderate"
        }
        else if(aqi<150){
            aqi_result="Unhealthy for Sensitive Groups"
        }
        else if(aqi<200){
            aqi_result="Unhealthy"
        }
        else if(aqi<300){
            aqi_result="Very Unhealthy"
        }
        else{
            aqi_result="Hazardous"
        }
        air_quality.innerHTML=`<div class="card_head">
                                    <img src="./img/air_quality_icon.svg" alt="">
                                    <p>AIR QUALITY</p>
                                </div>
                                <h1>${aqi} — ${aqi_result}</h1>
                                <span>Air quality index is ${aqi}, which is the same as yesterday at about this time.</span>
                                <div class="gradient_bar_air_quality"></div>`
        document.querySelector('footer').innerHTML=`<h1>Weather for ${city[0]+city.slice(1)}</h1>
        <span>Learn more about <u>weather data</u> and <u>map data</u></span>`
        const uv_index=document.querySelector('.uv_index')
        let uv_result
        if(hourly_data.current.uv<=2){
            uv_result="Low"
        }
        else if(hourly_data.current.uv<=5){
            uv_result="Moderate"
        }
        else if(hourly_data.current.uv<=7){
            uv_result="High"
        }
        else if(hourly_data.current.uv<=10){
            uv_result="Very High"
        }
        else{
            uv_result="Extreme"
        }
        let uv_time
        hourly_data.forecast.forecastday[0].hour.forEach((element,index)=>{
            if(element.uv>2){
                uv_time=index
            }
        })
        const sunset_time=new Date(today_data.sys.sunset*1000).toTimeString().slice(0,5)
        const sunrise_time=new Date(today_data.sys.sunrise*1000).toTimeString().slice(0,5)
        uv_index.innerHTML=`<div class="card_head">
                                        <img src="./img/uv_index_icon.svg" alt="">
                                        <p>UV INDEX</p>
                                    </div>
                                    <h2>${hourly_data.current.uv}</h2>
                                    <h2>${uv_result}</h2>
                                    <div class="gradient_bar_uv"></div>
                                    <p>Use sun protection until ${uv_time}:00.</p>`
        document.querySelector('.sunset').innerHTML=`<section class="card_head">
                                        <img src="./img/sunset_icon.svg" alt="">
                                        <p>SUNSET</p>
                                    </section>
                                    <h1>${sunset_time}</h1>
                                    <img src="./img/sunset.png" alt="">
                                    <span>Sunrise: ${sunrise_time}</span>`
        document.querySelector('.start').style.display='none'
        document.querySelector('.weather').style.display='flex'
        document.querySelector('footer').style.display='flex'

    }
    catch (error){
        console.log(error.message);
    }
}


document.querySelector('button').addEventListener('click',()=>{if(document.querySelector('input').value.trim()!=""){fetchData()}})
document.querySelector('input').addEventListener('keydown',(e)=> {if(e.key=="Enter" && document.querySelector('input').value.trim()!=""){fetchData()}})