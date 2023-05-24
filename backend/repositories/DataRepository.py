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
        sql = "SELECT * from historiek WHERE DeviceId = %s"
        params = [id]
        return Database.get_rows(sql, params)

