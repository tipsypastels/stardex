use gloo::timers::callback::Timeout;
use implicit_clone::ImplicitClone;
use std::time::Duration;
use web_sys::js_sys::Date;
use yew::prelude::*;

const WAIT: Duration = Duration::from_secs(1);

#[hook]
pub fn use_debounce() -> DebounceHandle {
    let last_changed = use_state(f64::default);
    DebounceHandle { last_changed }
}

#[derive(Debug, Clone, ImplicitClone)]
pub struct DebounceHandle {
    last_changed: UseStateHandle<f64>,
}

impl DebounceHandle {
    pub fn debounce(&self, f: impl Fn() + 'static) {
        self.last_changed.set(Date::now());

        let this = self.clone();
        let timeout = Timeout::new(WAIT.as_millis() as u32, move || {
            if this.exceeded_wait() {
                f();
            }
        });

        timeout.forget();
    }

    pub fn is_debouncing(&self) -> bool {
        !self.exceeded_wait() && self.ever_changed()
    }

    fn exceeded_wait(&self) -> bool {
        let time_since_last_change = Date::now() - self.last_changed();
        time_since_last_change > WAIT.as_millis() as f64
    }

    fn last_changed(&self) -> f64 {
        *self.last_changed
    }

    fn ever_changed(&self) -> bool {
        *self.last_changed >= 0.0
    }
}
