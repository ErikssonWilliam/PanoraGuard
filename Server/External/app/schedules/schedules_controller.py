from app.models import *
from flask import jsonify
from .schedules_service import ScheduleService

#will request entered data, tries the calls and returns the results

class ScheduleController: 
    def get_schedules():
        return ScheduleService.get_schedules()
    
    def add_schedule():
        return ScheduleService.add_schedule()
    
    def get_schedule_by_id(schedule_id):
        return ScheduleService.get_schedule_by_id(schedule_id)
    
    def delete_schedule_by_id(schedule_id):
        return ScheduleService.delete_schedule_by_id(schedule_id)