#![cfg(target_os = "linux")]

/// Uses only a disposable test credential, never the user's SSH credentials.
#[test]
#[ignore = "requires an unlocked desktop Secret Service; run explicitly on Linux"]
fn secret_service_round_trip() {
    let user = format!("linux-smoke-{}", uuid::Uuid::new_v4());
    let entry = keyring::Entry::new("com.racktop.desktop.test", &user).unwrap();
    entry.set_password("racktop-disposable-test-password").unwrap();
    let reopened = keyring::Entry::new("com.racktop.desktop.test", &user).unwrap();
    let result = reopened.get_password();
    entry.delete_credential().unwrap();
    assert_eq!(result.unwrap(), "racktop-disposable-test-password");
    assert!(matches!(reopened.get_password(), Err(keyring::Error::NoEntry)));
}
