#include "quantumx_HidConnection.h"
#include "hid.h"
#include <stdio.h>


JNIEXPORT jboolean JNICALL Java_quantumx_HidConnection_open
  (JNIEnv *env, jobject obj) {
    rawhid_open(10, 0x16C0, 0x27DB, 0xFF11, 0x2509);
    return 1;
}

#define DEVICE_LIMIT 10
JNIEXPORT jobjectArray JNICALL Java_quantumx_HidConnection_getDevices
  (JNIEnv *env, jobject obj) {
    jshortArray ret;
    const char* result[DEVICE_LIMIT];
    int count = get_devices(result, DEVICE_LIMIT);
    ret = (jobjectArray)(*env)->NewObjectArray(env, count, (*env)->FindClass(env, "java/lang/String"), (*env)->NewStringUTF(env, ""));
    for (int i = 0; i < count; i++) {
        (*env)->SetObjectArrayElement(env, ret, i, (*env)->NewStringUTF(env, result[i]));
    }
    return(ret);
}

#define BUF_SIZE 64
JNIEXPORT jbyteArray JNICALL Java_quantumx_HidConnection_receiveMessage
  (JNIEnv *env, jobject obj, jstring device_id, jint timeout) {
    jbyteArray ret;
    int fixedSize = 64;
    jbyte buf[BUF_SIZE];

    int rc = rawhid_recv((*env)->GetStringUTFChars(env, device_id, 0), buf, fixedSize, timeout);
    if (rc != fixedSize) {
        return 0;
    }
    ret = (*env)->NewByteArray(env, fixedSize);
    (*env)->SetByteArrayRegion(env, ret, 0, fixedSize, buf);
    return ret;
}


JNIEXPORT jboolean JNICALL Java_quantumx_HidConnection_sendMessage
  (JNIEnv *env, jobject obj, jstring device_id, jbyteArray msg, jint timeout) {
    int fixedSize = 64;
    int arrSize = (*env)->GetArrayLength(env, msg);
    if (arrSize != fixedSize) {
        printf("Only 64 bytes segment can be sent");
        fflush(stdout);
        return (jboolean)0;
    }
    jbyte *buf = (*env)->GetByteArrayElements(env, msg, 0);
    int rc = rawhid_send((*env)->GetStringUTFChars(env, device_id, 0), buf, fixedSize, timeout);
    if (rc == -1) {
        return (jboolean)0;
    } else {
        return (jboolean)1;
    }
}


