from .dataprocessing_service import DataprocessingService


class DataprocessingController:
    def processData():
        # Needed to create an instance here, since I could not
        # have functions depending on other functions in dataprocessing_service
        # without passing self between them. The old code is commented
        service = DataprocessingService()
        return service.receive_data()
