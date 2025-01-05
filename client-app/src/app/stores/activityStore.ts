import { makeAutoObservable } from "mobx";
import { Activity } from "../models/activity";
import agent from "../api/Agent";
import {v4 as uuid} from 'uuid';

export default class ActivityStore {
    
    activities: Activity[] = [];
    activityRegistry = new Map<string, Activity>();
    selectedActivity: Activity | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = false;


    constructor(){
        makeAutoObservable(this);
    }

    loadActivities = async () => {
        this.setLoadingInitial(true);
        try{
            const activities = await agent.Activities.list();
            activities.forEach(activity => {
                activity.date = activity.date.split('T')[0];
                this.activities.push(activity);
              });
              this.setLoadingInitial(false);
        } catch(error) {
            console.log(error);
            this.setLoadingInitial(false);
        }
    }

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    selectActivity = (id: String) => {
        this.selectedActivity = this.activities.find(x => x.id === id);
    }

    cancelSelectedActivity = () => {
        this.selectedActivity = undefined;    
    }

    openForm = (id?: String) => {
        id ? this.selectActivity(id) : this.cancelSelectedActivity();
        this.editMode = true;
    }

    closeForm = () => {
        this.editMode = false;
    }

    createActivity = async (activity: Activity) => {
        this.loading = true;
        activity.id = uuid();
        try{
            await agent.Activities.create(activity);
            this.activities.push(activity);
            this.selectedActivity = activity;
            this.editMode = false;
            this.loading = false;
        } catch(error) {
            console.log(error);
            this.loading = false;
        }
    }

    updateActivity = async (activity: Activity) => {
        this.loading = true;
        try {
            await agent.Activities.update(activity);
            this.activities = [...this.activities.filter(a => a.id !== activity.id), activity];
            this.selectedActivity = activity;
            this.editMode = false;
            this.loading = false;
        } catch(error) {
            console.log(error);
            this.loading = false;
        }
    }

    deleteActivity = async (id: string) => {
        this.loading = true;
        try {
            await agent.Activities.delete(id);
            this.activities = [...this.activities.filter(x => x.id !== id)];           
            if(this.selectedActivity?.id === id) this.cancelSelectedActivity();
            this.editMode = false;
            this.loading = false;
        } catch(error) {
            console.log(error);
            this.loading = false;
        }
    }
}