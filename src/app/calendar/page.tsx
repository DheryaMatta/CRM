'use client';

import React, { useState } from 'react';
import { useCRM } from '@/context/CRMContext';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';

export default function CalendarAndTasks() {
  const { tasks, toggleTask, addTask } = useCRM();
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskCat, setTaskCat] = useState<'High Intent' | 'Action Needed' | 'Meeting' | 'Info'>('Action Needed');
  const [taskTime, setTaskTime] = useState('');

  // Static month rendering (June 2026 - matching system local time month)
  const monthName = 'June 2026';
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // June 2026 starts on a Monday (index 1)
  const startingDayIndex = 1;
  const totalDays = 30;

  // Distribute tasks on calendar days (mock positioning)
  const getDayEvents = (day: number) => {
    if (day === 27) { // Current day
      return tasks.filter((t) => t.category === 'Meeting' || t.category === 'High Intent');
    }
    if (day === 28) {
      return tasks.filter((t) => t.category === 'Action Needed');
    }
    return [];
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle) return;

    addTask({
      title: taskTitle,
      description: taskDesc || 'No description provided.',
      category: taskCat,
      time: taskTime || 'Today',
    });

    setTaskTitle('');
    setTaskDesc('');
    setTaskCat('Action Needed');
    setTaskTime('');
  };

  // Generate calendar days array
  const calendarCells = [];
  // Empty slots for preceding month
  for (let i = 0; i < startingDayIndex; i++) {
    calendarCells.push(null);
  }
  // Days of current month
  for (let i = 1; i <= totalDays; i++) {
    calendarCells.push(i);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-lg">
      {/* Left 3 columns: Calendar Grid */}
      <div className="lg:col-span-3 bg-surface-container-lowest dark:bg-inverse-surface border border-outline-variant dark:border-outline rounded-xl p-md shadow-xs flex flex-col">
        {/* Calendar Header */}
        <div className="flex justify-between items-center mb-md pb-xs border-b border-outline-variant/30">
          <div className="flex items-center gap-xs">
            <CalendarDays className="text-primary" size={24} />
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface dark:text-inverse-on-surface">
              {monthName}
            </h3>
          </div>
          <div className="flex gap-1">
            <button className="p-1 rounded-lg border border-outline-variant hover:bg-surface-container-low text-on-surface-variant cursor-pointer">
              <ChevronLeft size={20} />
            </button>
            <button className="p-1 rounded-lg border border-outline-variant hover:bg-surface-container-low text-on-surface-variant cursor-pointer">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Days of Week Grid */}
        <div className="grid grid-cols-7 gap-xs text-center border-b border-outline-variant/30 pb-xs mb-xs">
          {daysOfWeek.map((day) => (
            <div key={day} className="font-label-sm text-label-sm text-on-surface-variant font-bold uppercase tracking-wider py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Cells Grid */}
        <div className="grid grid-cols-7 gap-xs flex-1 min-h-[400px]">
          {calendarCells.map((day, idx) => {
            const isToday = day === 27; // June 27 is current day in June 2026
            const dayEvents = day ? getDayEvents(day) : [];

            return (
              <div
                key={idx}
                className={`min-h-[80px] p-xs border border-outline-variant/20 rounded-lg flex flex-col justify-between transition-colors ${
                  day ? 'bg-surface dark:bg-surface-dim/20' : 'bg-transparent border-none'
                } ${isToday ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-inverse-surface' : ''}`}
              >
                {day ? (
                  <>
                    <div className="flex justify-between items-center">
                      <span
                        className={`font-label-sm text-label-sm font-semibold flex items-center justify-center w-6 h-6 rounded-full ${
                          isToday ? 'bg-primary text-on-primary font-bold' : 'text-on-surface dark:text-inverse-on-surface'
                        }`}
                      >
                        {day}
                      </span>
                    </div>

                    {/* Events for this day */}
                    <div className="flex-1 mt-sm flex flex-col gap-1 overflow-y-auto">
                      {dayEvents.map((evt) => (
                        <div
                          key={evt.id}
                          title={`${evt.title}: ${evt.description}`}
                          className={`px-1.5 py-0.5 rounded text-[10px] truncate leading-tight font-medium ${
                            evt.status === 'completed'
                              ? 'bg-outline-variant/30 text-on-surface-variant/70 line-through'
                              : evt.category === 'Meeting'
                              ? 'bg-primary-container text-on-primary-container border-l-2 border-primary'
                              : evt.category === 'High Intent'
                              ? 'bg-error-container/60 text-error border-l-2 border-error'
                              : 'bg-secondary-container/40 text-on-secondary-container border-l-2 border-secondary'
                          }`}
                        >
                          {evt.title}
                        </div>
                      ))}
                    </div>
                  </>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right column: Task List sidebar */}
      <div className="lg:col-span-1 flex flex-col gap-md">
        {/* Create Task Form */}
        <div className="bg-surface-container-lowest dark:bg-inverse-surface border border-outline-variant dark:border-outline rounded-xl p-md shadow-xs">
          <h4 className="font-label-md text-label-md text-on-surface dark:text-inverse-on-surface font-bold mb-sm">
            Add New Task
          </h4>
          <form onSubmit={handleAddTask} className="space-y-sm">
            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-[11px] text-on-surface-variant">Task Title</label>
              <input
                type="text"
                required
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="e.g. Schedule call with Stark"
                className="px-sm py-1.5 rounded-lg border border-outline-variant bg-surface-bright dark:bg-surface-container-low text-body-sm text-on-surface dark:text-inverse-on-surface outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-[11px] text-on-surface-variant">Time / Due</label>
              <input
                type="text"
                value={taskTime}
                onChange={(e) => setTaskTime(e.target.value)}
                placeholder="e.g. Tomorrow 3 PM, In 2h"
                className="px-sm py-1.5 rounded-lg border border-outline-variant bg-surface-bright dark:bg-surface-container-low text-body-sm text-on-surface dark:text-inverse-on-surface outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-[11px] text-on-surface-variant">Priority Category</label>
              <select
                value={taskCat}
                onChange={(e) => setTaskCat(e.target.value as any)}
                className="px-sm py-1.5 rounded-lg border border-outline-variant bg-surface-bright dark:bg-surface-container-low text-body-sm text-on-surface dark:text-inverse-on-surface outline-none"
              >
                <option value="High Intent">High Intent</option>
                <option value="Action Needed">Action Needed</option>
                <option value="Meeting">Meeting</option>
                <option value="Info">Info</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-[11px] text-on-surface-variant">Description</label>
              <textarea
                value={taskDesc}
                onChange={(e) => setTaskDesc(e.target.value)}
                placeholder="Details..."
                rows={2}
                className="px-sm py-1.5 rounded-lg border border-outline-variant bg-surface-bright dark:bg-surface-container-low text-body-sm text-on-surface dark:text-inverse-on-surface outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-container text-on-primary rounded-lg py-1.5 font-label-md text-label-md transition-colors font-semibold cursor-pointer"
            >
              Add Task
            </button>
          </form>
        </div>

        {/* Task List items */}
        <div className="bg-surface-container-lowest dark:bg-inverse-surface border border-outline-variant dark:border-outline rounded-xl p-md shadow-xs flex-1 flex flex-col min-h-[300px]">
          <h4 className="font-label-md text-label-md text-on-surface dark:text-inverse-on-surface font-bold pb-xs border-b border-outline-variant/30 mb-sm">
            Task Checklist
          </h4>
          <div className="flex-1 overflow-y-auto space-y-sm">
            {tasks.map((t) => (
              <div
                key={t.id}
                className="flex items-start gap-sm p-sm bg-surface dark:bg-surface-dim/30 rounded-lg border border-outline-variant/20 group"
              >
                <input
                  type="checkbox"
                  checked={t.status === 'completed'}
                  onChange={() => toggleTask(t.id)}
                  className="mt-1 rounded border-outline-variant text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                />
                <div className="flex-1 min-w-0">
                  <h5
                    className={`font-body-sm text-body-sm font-semibold truncate ${
                      t.status === 'completed'
                        ? 'text-on-surface-variant/60 line-through'
                        : 'text-on-surface dark:text-inverse-on-surface'
                    }`}
                  >
                    {t.title}
                  </h5>
                  <p className="font-label-sm text-[11px] text-on-surface-variant truncate mt-0.5">
                    {t.description}
                  </p>
                  <span className="font-label-sm text-[10px] text-on-surface-variant/80 mt-1 block">
                    {t.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
