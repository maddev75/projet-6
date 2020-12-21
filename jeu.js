
$(function () {
    getRandomInt = (max) => {
        return Math.floor(Math.random() * Math.floor(max));
    }
    let weaponOne = new Arme('gun', 50, 'img-jeux/gun.jpg');
    let weaponTwo = new Arme('mitraillette', 100, 'img-jeux/mitraillette.jpg');
    let weaponTree = new Arme('missile', 150, 'img-jeux/missile.jpg');
    let weaponFour = new Arme('lance-rocket', 200, 'img-jeux/lance-rocket.jpg');
    //let weaponFive = new Arme('pistolet', 20, 'img-jeux/pistolet.png');

    let weapons = [weaponOne, weaponTwo, weaponTree, weaponFour];
    let player1 = new Soldat('soldat1', { x: 0, y: 0 });
    let player2 = new Soldat('soldat2', { x: 0, y: 0 });
    let players = [player1, player2];
    const map = new Map('#map', 10, 10, 10, weapons, players);
    //let logoSante = $('#soldat1-sante').append(player1.sante);
    //let logoArme = $("#soldat1-arme").append(player1.arme.name);
    //let logoDegat = $('#soldat1-degat').append(arme.damage);
    //let logoImage = $('#image-arme').append(arme.style);
    let currentPlayer;
    let currentPlayerNb = getRandomInt(players.length);
    if (currentPlayerNb === 0) {
        alert('Le soldat 1 commence')
        currentPlayer = map.players[0]
    } else {
        alert('Le soldat 2 commence')
        currentPlayer = map.players[1]
    }
    displayMoves(currentPlayer, map);
    listenMoves(map, currentPlayer);
    function displayMoves(currentPlayer, map) {
        map.setMooveValable('right', currentPlayer, 3);
        map.setMooveValable('left', currentPlayer, 3);
        map.setMooveValable('top', currentPlayer, 3);
        map.setMooveValable('bottom', currentPlayer, 3);
    }
    function listenMoves(map, currentPlayer) {
        let moveAvailableCases = $('.yellow');
        moveAvailableCases.on('click', (event) => {
            moveAvailableCases.off();
            moveAvailableCases.removeClass('yellow');
            let caseInfo = event.target.id.split('_')
            let caseCliquee = $("#" + event.target.id);
            let currentPlayerCase = $('#col_' + currentPlayer.position.x + '_' + currentPlayer.position.y);
            let classesJoueur = currentPlayerCase.attr("class").split(/\s+/);
            let classesCliquee = caseCliquee.attr('class').split(/\s+/);
            console.log('classesclique', classesCliquee);
            let lastWeaponPlayer = currentPlayer.weapon;
            currentPlayer.position.x = caseInfo[1];
            currentPlayer.position.y = caseInfo[2];
            if (classesCliquee.includes('weapon')) {
                exchangeWeapons(classesCliquee, caseCliquee, lastWeaponPlayer);
            }
            if (classesJoueur.includes('weapon')) {
                updateWeapons(classesJoueur, currentPlayerCase, changeJoueur);
            }else{
                changeJoueur = classesJoueur;
                currentPlayerCase.removeClass(changeJoueur);
                currentPlayerCase.addClass('col');
            }
            caseCliquee.addClass("col");
            caseCliquee.addClass('player');
            caseCliquee.addClass(currentPlayer.pseudo);
            if (currentPlayer === map.players[0]) {
                currentPlayer = map.players[1];
            }else{
                currentPlayer = map.players[0];
            }
            if (Math.abs(map.players[0].position.x === map.players[1].position.x) && Math.abs(map.players[0].position.y - map.players[1].position.y) === 1) {
                alert('le combat commence');
                fight(currentPlayer);
                return;
                attaquer(currentPlayer, lastWeaponPlayer.name);
            }
            else if (Math.abs(map.players[0].position.y === map.players[1].position.y) && Math.abs(map.players[0].position.x - map.players[1].position.x) === 1) {
                alert('le combat commence');
                fight(currentPlayer);
                return;
                attaquer(currentPlayer, lastWeaponPlayer.name);
            }
            displayMoves(currentPlayer, map);
            listenMoves(map, currentPlayer);
        })
    }
    function exchangeWeapons(classesCliquee, caseCliquee, lastWeaponPlayer) {
        classesCliquee.splice(classesCliquee.indexOf('col'), 1); // on supprime col du tableau classesCliquee
        classesCliquee.splice(classesCliquee.indexOf('weapon'), 1); // on supprime weapon du tableau classesCliquee
        console.log("lastWeaponPlayer", lastWeaponPlayer)
        let foundWeapon = map.weapons.find(elt => elt.name === classesCliquee[0]);
        currentPlayer.weapon = foundWeapon;
        let foundWeaponIndex = map.weapons.findIndex(elt => elt.name === foundWeapon.name)
        map.weapons.splice(foundWeaponIndex, 1);
        map.weapons.push(lastWeaponPlayer);
        console.log('Weapons de la map', map.weapons);
        caseCliquee.addClass(lastWeaponPlayer.name);
        caseCliquee.addClass('weapon');
        caseCliquee.removeClass(foundWeapon.name);
    }
    function updateWeapons(classesJoueur, currentPlayerCase, changeJoueur) {
        classesJoueur.splice(classesJoueur.indexOf('col'), 1); // on supprime col du tableau classesCliquee
        classesJoueur.splice(classesJoueur.indexOf('player'), 1); // on supprime PLAYER du tableau classesCliquee
        if (classesJoueur.includes('soldat1')) { classesJoueur.splice(classesJoueur.indexOf('soldat1'), 1); currentPlayerCase.removeClass('soldat1'); }
        else { classesJoueur.splice(classesJoueur.indexOf('soldat2'), 1); currentPlayerCase.removeClass('soldat2'); }
        if (classesJoueur.indexOf('gun') >= 0) { classesJoueur.splice(classesJoueur.indexOf('gun'), 1) };
        if (classesJoueur.indexOf('mitraillette') >= 0) { classesJoueur.splice(classesJoueur.indexOf('mitraillette'), 1) };
        if (classesJoueur.indexOf('missile') >= 0) { classesJoueur.splice(classesJoueur.indexOf('missile'), 1) };
        if (classesJoueur.indexOf('lance-rocket') >= 0) { classesJoueur.splice(classesJoueur.indexOf('lance-rocket'), 1) };
        if (classesJoueur.indexOf('pistolet') >= 0) { classesJoueur.splice(classesJoueur.indexOf('pistolet'), 1) };
        changeJoueur = classesJoueur.join(' ');
        currentPlayerCase.removeClass('player');
    }
    function fight(currentPlayer){
        let agresseur;
        if(currentPlayer === map.players[0]){//cible
            agresseur = map.players[1];
        }else{
            agresseur = map.players[0];
        }
        let butonAttaq = document.getElementById('attaq');
        butonAttaq.addEventListener('click', () =>{
            attaquer(currentPlayer, agresseur);
            if(currentPlayer.sante <=0 || agresseur.sante <=0){
                alert('le combat est fini');
            }
            if(agresseur === map.players[0]) {
                agresseur = map.players[1];
                currentPlayer = map.players[0];
            }else{
                agresseur = map.players[0]
                currentPlayer = map.players[1];
            }
        })
        let butonDefense = document.getElementById('defense');
        butonDefense.addEventListener('click', ()=>{
            defense(currentPlayer, agresseur);
            if(agresseur === map.players[0]) {
                agresseur = map.players[1];
                currentPlayer = map.players[0];
            }else{
                agresseur = map.players[0]
                currentPlayer = map.players[1];
            }
        })
    }
    function attaquer(currentPlayer, agresseur){
        currentPlayer.sante -= currentPlayer.defendre ? agresseur.weapon.damage/2 : agresseur.weapon.damage;
        console.log('agresseur', agresseur);
        console.log('cible', currentPlayer);
        currentPlayer.defendre = false;
    }
    function defense(currentPlayer, agresseur){
        agresseur.defendre = true;
        return 'cible', currentPlayer.sante;
    }
});















