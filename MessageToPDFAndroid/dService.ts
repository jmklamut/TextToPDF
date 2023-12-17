import { enablePromise, openDatabase} from 'react-native-sqlite-storage';
//import android.database.sqlite.SQLiteDatabase;

enablePromise(true);

export const getDBConnection =async () => {
  return openDatabase({ name: "mmssms.db", createFromLocation: "/data/data/com.android.providers.telephony/databases/"}, () => {console.log("Location Found")}, error => console.log(error));
  //return openDatabase("/data/data/com.android.providers.telephony/databases/", null, 0)
};


