#include "quantumx_HidConnection.h"


/*
 * Class:     quantumx_HidConnection
 * Method:    open
 * Signature: ()[Ljava/lang/String;
 */
JNIEXPORT jobjectArray JNICALL Java_quantumx_HidConnection_open
  (JNIEnv *env, jobject obj) {
    jobjectArray ret;
    int i;

    char *data[5]= {"A", "B", "C", "D", "E"};

    ret= (jobjectArray)(*env)->NewObjectArray(env, 5,(*env)->FindClass(env, "java/lang/String"),(*env)->NewStringUTF(env, ""));

    for(i=0;i<5;i++) (*env)->SetObjectArrayElement(env, ret,i,(*env)->NewStringUTF(env, data[i]));

    return(ret);
}

/*
 * Class:     quantumx_HidConnection
 * Method:    receiveMessage
 * Signature: (SI)[B
 */
JNIEXPORT jbyteArray JNICALL Java_quantumx_HidConnection_receiveMessage
  (JNIEnv *env, jobject obj, jshort modelId, jint abc) {
  return 0;
}

/*
 * Class:     quantumx_HidConnection
 * Method:    sendMessage
 * Signature: (S[BI)Z
 */
JNIEXPORT jboolean JNICALL Java_quantumx_HidConnection_sendMessage
  (JNIEnv *env, jobject obj, jshort modelId, jbyteArray msg, jint abc) {
  return 0;
}


