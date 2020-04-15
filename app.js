window.addEventListener('load', ()=>
{

    const localisation = document.querySelector('.localisation');
    const temperatureAct = document.querySelector('.temperature');
    const description = document.querySelector('.description');
    const joursSemaine = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
    const joursDiv = document.querySelectorAll('.joursSem');
    const heure = document.querySelectorAll('.heure');
    const tempPourH = document.querySelectorAll('.tempPourH');
    const loader = document.querySelector('.loader');
    const erreur = document.querySelector('.erreur');

    //date
    let newDate = new Date();
    let options = {weekday: 'long'}; //option pour la date la on veut juste le jour
    let jourActuel = newDate.toLocaleDateString('fr-FR', options);
    jourActuel = jourActuel.charAt(0).toUpperCase() + jourActuel.slice(1);
    console.log(jourActuel);


    //donne les 7 jours de la semaine en fonction du jour actuel pour les trier
    let tabJoursEnOrdre = joursSemaine.slice(joursSemaine.indexOf(jourActuel)).concat(joursSemaine.slice(0, joursSemaine.indexOf(jourActuel))); //slice permet de couper
    // console.log(tabJoursEnOrdre);

    for (i=0; i<tabJoursEnOrdre.length; i++)
    {
        joursDiv[i].innerHTML = tabJoursEnOrdre[i].slice(0,3); //for loop
    }


    //Les heures par tranche de 3
    // console.log(newDate.getHours());
    let heureActuelle = newDate.getHours();

    //pour chaque div a remplir
    for(j=0; j<heure.length; j++)
    {
        //l'heure toutes les 3 heures
        let hTrue = heureActuelle + j * 3 ;
        if(hTrue>24)
        {
            heure[j].innerHTML =`${hTrue - 24} h`
        }else if(hTrue === 24)
        {
            heure[j].innerHTML =`00 h`
        }else 
        {
            heure[j].innerHTML =`${hTrue} h`
        }
    }


    if(navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(position => {

             // console.log(position);

            long = position.coords.longitude;
            lat = position.coords.latitude;

            const proxy = 'https://cors-anywhere.herokuapp.com/'
            const api = `${proxy}https://api.darksky.net/forecast/4fed711f7d39b056b851da30582ac709/${lat},${long}?lang=fr`
            
            fetch(api)
            .then(reponse => {
                console.log(reponse);

                return reponse.json();
            })
            .then(data => {
                /*.then sont des "promesses"*/
                    console.log(data);

                    const {summary, temperature, icon} = data.currently; /*permet d'isoler*/
                    description.textContent = summary;
                    temperatureAct.textContent =`${Math.trunc((temperature-32)*5/9)}° Deg`; /*conversion degres*/
                    localisation.textContent = data.timezone;

                    setIcons(icon, document.querySelector('#icone'));

                        //mise en place des icones de previsions
                    for(n = 0; n<7; n++)
                    {
                        setIcons(data.daily.data[n].icon, document.querySelector(`#icone${n+2}`)); //n+2 car on commence a icone2
                    }

                    //temps toutes les 3h
                    for (m=0; m<tempPourH.length; m++)
                    {
                        tempPourH[m].innerHTML = `${Math.trunc((data.hourly.data[m*3].temperature - 32) *5/9)}°`;
                    } /* innerHTML ecrase les données fille(body) de la balise tempPourH*/
                
                    /*cacher l'icone*/
                    loader.className += ' hidden';
                
                }, function(){
                    // console.log('acces refusé');
                    erreur.innerHTML = `Vous avez refusé la géolocalisation, l'application ne peut pas fonctionner, veuillez l'activer.`;
                })



        })
       
    }
    //icon = type d'icone pluie vent soleil, iconID = le canvas
    function setIcons(icon, iconID)
    {
        const skycons = new Skycons({color: 'white'});
        const currentIcon = icon.replace(/-/g, '_').toUpperCase(); //g = global
        skycons.play();
        
        return skycons.set(iconID, Skycons[currentIcon])
    }



})