use macos::Event;
use serde::Serialize;
use tauri::{AppHandle, Manager};

#[cfg(target_os = "macos")]
mod macos;
#[cfg(target_os = "macos")]
use crate::macos::listen as macos_listen;
#[cfg(target_os = "macos")]
use crate::macos::EventType;

#[derive(Clone, Serialize)]
struct KeyEventPayload {
    event_type: String,
    key: String,
}

fn macos_callback(event: Event, app: &AppHandle) {
    match event.event_type {
        EventType::KeyPress(key) => {
            // println!("KeyPress: {:?}", key);
            let key_str = format!("{:?}", key);

            app.emit_all(
                "key-event",
                KeyEventPayload {
                    event_type: "KeyPress".to_string(),
                    key: key_str,
                },
            )
            .unwrap();
        }
        EventType::KeyRelease(key) => {
            // println!("KeyRelease: {:?}", key)
            let key_str = format!("{:?}", key);

            app.emit_all(
                "key-event",
                KeyEventPayload {
                    event_type: "KeyRelease".to_string(),
                    key: key_str,
                },
            )
            .unwrap();
        }
        _ => {}
    }
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let app_handle = app.app_handle().to_owned();

            #[cfg(target_os = "linux")]
            thread::spawn(|| {
                println!("On linux");
            });

            #[cfg(target_os = "macos")]
            if let Err(error) = macos_listen(move |event| {
                macos_callback(event, &app_handle);
            }) {
                println!("Error: {:?}", error);
            };

            Ok(())
        })
        // .invoke_handler(tauri::generate_handler![])
        .build(tauri::generate_context!())
        .expect("error while running tauri application")
        .run(|_app_handle, event| match event {
            tauri::RunEvent::ExitRequested { api, .. } => {
                api.prevent_exit();
            }
            _ => {}
        })
}
