from .Database import Database


class DataRepository:
    @staticmethod
    def json_or_formdata(request):
        if request.method != 'GET' and request.content_type == 'application/json':
            gegevens = request.get_json()
        else:
            gegevens = request.form.to_dict()
        return gegevens

    @staticmethod
    def read_all_devices():
        sql = "SELECT * from device"
        return Database.get_rows(sql)

    @staticmethod
    def read_history_by_deviceid(id):
        sql = "SELECT d.DeviceId, h.DatumTijd, h.Waarde, d.Beschrijving, d.Meeteenheid, d.Naam, h.Commentaar FROM historiek h join device d on h.DeviceId = d.DeviceId where d.DeviceId = %s  AND h.DatumTijd >= DATE_SUB(NOW(), INTERVAL 1 DAY) ORDER BY h.DatumTijd desc"
        params = [id]
        return Database.get_rows(sql, params)

    @staticmethod
    def read_last_device_history(id):
        sql = "SELECT * from historiek WHERE DeviceId = %s ORDER BY Volgnummer desc LIMIT 1"
        params = [id]
        return Database.get_one_row(sql,params)
    
    @staticmethod
    def add_history(device_id,actie_id,waarde,commentaar):
        sql = "INSERT INTO historiek (DeviceId, ActieId, Waarde, Commentaar) VALUES (%s,%s,%s,%s)"
        params = [device_id,actie_id,waarde,commentaar]
        return Database.execute_sql(sql,params)
    
    @staticmethod
    def read_history_for_length(length):
        sql = "SELECT * from historiek ORDER BY volgnummer desc LIMIT %s"
        params = [length]
        return Database.get_rows(sql,params)
    
    @staticmethod
    def read_history_timeline():
        sql = "SELECT * from historiek WHERE DeviceId in (4,5) ORDER BY volgnummer desc LIMIT 4"
        return Database.get_rows(sql)
    
    @staticmethod
    def read_config(id):
        sql = "SELECT * from gebruiker WHERE GebruikerId = %s"
        params = [id]
        return Database.get_one_row(sql, params)
    
    @staticmethod
    def update_config_full(id, modus, open, sluit, voer):
        sql = "UPDATE gebruiker SET OpenTijd = %s, SluitTijd =%s, VoederTijd = %s, Modus = %s WHERE GebruikerId = %s;"
        params = [open,sluit,voer,modus,id]
        return Database.execute_sql(sql, params)

    @staticmethod
    def update_config_small(id, modus, voer):
        sql = "UPDATE gebruiker SET VoederTijd = %s, Modus = %s WHERE GebruikerId = %s;"
        params = [voer,modus,id]
        return Database.execute_sql(sql, params)

    @staticmethod
    def read_device_details(id):
        sql = "SELECT * FROM device WHERE DeviceId = %s"
        params = [id]
        return Database.execute_sql(sql, params)

