#include "quantumx_HidConnection.h"
#include "hid.h"

/*
 * Class:     quantumx_HidConnection
 * Method:    open
 * Signature: ()Z
 */
JNIEXPORT jboolean JNICALL Java_quantumx_HidConnection_open
  (JNIEnv *env, jobject obj) {
    rawhid_open(1, 0x16C0, -1, 0xFFAB, 0x0200);
    return 1;
}

/*
 * Class:     quantumx_HidConnection
 * Method:    cgetModels
 * Signature: ()[S
 */
JNIEXPORT jshortArray JNICALL Java_quantumx_HidConnection_getModels
  (JNIEnv *env, jobject obj) {
    jshortArray ret;
    int limit = 10;
    uint16_t result[limit];
    int count = get_models(result, limit);
    ret= (jshortArray)(*env)->NewShortArray(env, count);
    (*env)->SetShortArrayRegion(env, ret, 0, count, result);
    return(ret);
}

/*
 * Class:     quantumx_HidConnection
 * Method:    receiveMessage
 * Signature: (SI)[B
 */
JNIEXPORT jbyteArray JNICALL Java_quantumx_HidConnection_receiveMessage
  (JNIEnv *env, jobject obj, jshort model_id, jint timeout) {
    jbyteArray ret;
    int fixedSize = 64;
    jbyte buf[fixedSize];

    int rc = rawhid_recv(model_id, buf, fixedSize, timeout);
    if (rc != fixedSize) {
        return 0;
    }
    ret = (*env)->NewByteArray(env, fixedSize);
    (*env)->SetByteArrayRegion(env, ret, 0, fixedSize, buf);
    return ret;
}

/*
 * Class:     quantumx_HidConnection
 * Method:    sendMessage
 * Signature: (S[BI)Z
 */
JNIEXPORT jboolean JNICALL Java_quantumx_HidConnection_sendMessage
  (JNIEnv *env, jobject obj, jshort model_id, jbyteArray msg, jint timeout) {
    int fixedSize = 64;
    int arrSize = (*env)->GetArrayLength(env, msg);
    if (arrSize != fixedSize) {
        printf("Only 64 bytes segment can be sent");
        fflush(stdout);
        return (jboolean)0;
    }
    jbyte *buf = (*env)->GetByteArrayElements(env, msg, 0);
    int rc = rawhid_send(model_id, buf, fixedSize, timeout);
    if (rc == -1) {
        return (jboolean)0;
    } else {
        return (jboolean)1;
    }
}


