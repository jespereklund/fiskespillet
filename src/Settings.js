class Settings
{
    static player = '';

    static load()
    {
        var data = JSON.parse( localStorage.getItem( Settings.Save_ID ));
        if ( !data ) data = {};
        if ( undefined !== data.player ) Settings.player = data.player;
    }

    static savePlayer(pl) {
        console.log(pl)
        var data =
        {
            player: pl
        };

        localStorage.setItem( Settings.Save_ID, JSON.stringify( data ));

    }

    static save()
    {
        var data =
        {
            player: Settings.player
        };

        localStorage.setItem( Settings.Save_ID, JSON.stringify( data ));
    }
    static Save_ID = 'Fiskespillet_v1';
}