# Kindeskind - OpenHAB
OpenHAB to integrate Philips HUE signal light

## MyOpenHAB and openHAB Cloud Connector AddOn
- Create an account on [myopenhab.org](http://www.myopenhab.org/)
- Install *openHAB Cloud Connector* AddOn to connect the local openHAB runtime to the remote myopenHAB.org cloud instance
- Insert local openHAB instance's *UUID* and *Secret* into AddOn Configuration

| File   | Regular Installation         | APT Installation                      |
| :----- | :--------------------------- | :------------------------------------ |
| UUID   | userdata/uuid                | /var/lib/openhab2/uuid                |
| Secret | userdata/openhabcloud/secret | /var/lib/openhab2/openhabcloud/secret |

## Start OpenHAB
### On Windows
- Execute `start.bat` in CMD or by double clicking it in Windows Explorer
```
.\start.bat
```

### On Linux or Mac
- Make `start.sh` executable
```
chmod +x start.sh
```
- Execute `start.sh` in terminal
```
./start.sh
```

## Authors
- Christof Kost
- Marco Maisel
- Steffen Mauser